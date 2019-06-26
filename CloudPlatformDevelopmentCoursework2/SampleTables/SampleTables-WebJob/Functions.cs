using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

using SampleTables.Models;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using NAudio.Wave;
using Microsoft.WindowsAzure.Storage.Blob;

namespace SampleTables_WebJob
{
    public class Functions
    {
        // This class contains the application-specific WebJob code consisting of event-driven
        // methods executed when messages appear in queues with any supporting code.

        // Trigger method  - run when new message detected in queue. "previewmaker" is name of queue.
        // "mp3gallery" is name of storage container; "mp3s" and "previews" are folder names. 
        // "{queueTrigger}" is an inbuilt variable taking on value of contents of message automatically;
        // the other variables are valued automatically.
        public static void GenerateSample(
            [QueueTrigger("previewmaker")]
            String blobInfo,
            [Blob("mp3gallery/mp3s/{queueTrigger}")] CloudBlockBlob inputBlob,
            [Blob("mp3gallery/previews/{queueTrigger}")] CloudBlockBlob outputBlob, TextWriter logger)
        {
            //use log.WriteLine() rather than Console.WriteLine() for trace output
            logger.WriteLine("GeneratePreview() started...");
            logger.WriteLine("Input blob is: " + blobInfo);

            // Open streams to blobs for reading and writing as appropriate.
            // Pass references to application specific methods
            using (Stream input = inputBlob.OpenRead())
            using (Stream output = outputBlob.OpenWrite())
            {
                //create 30 second sample
                CreateSample(input, output, 30);
                outputBlob.Properties.ContentType = "audio/mpeg3";
            }
            var metaData = inputBlob.Metadata["Title"];
            outputBlob.FetchAttributes();
            outputBlob.Metadata["Title"] = metaData;
            outputBlob.SetMetadata();

            logger.WriteLine("GeneratePreview() completed...");
        }

        private static void ManageTable(
            [QueueTrigger("previewmaker")]
            SampleEntity sampleInQueue,
            [Table("Samples", "{PartitionKey}", "{RowKey}")] SampleEntity sampleInTable,
            [Table("Samples")] CloudTable tableBinding, TextWriter logger)
        {
            //get storage accounts and table name
            CloudStorageAccount storage = CloudStorageAccount.Parse("UseDevelopmentStorage=false");
            CloudTableClient tableClient = storage.CreateCloudTableClient();
            CloudTable table = tableClient.GetTableReference("Samples");
            CloudBlobClient blobClient = storage.CreateCloudBlobClient();

            //create new sample
            var sampleEntity = new SampleEntity()
            {
                PartitionKey = sampleInQueue.PartitionKey,
                RowKey = sampleInQueue.RowKey,
                Title = sampleInQueue.Title,
                Artist = sampleInQueue.Artist,
                Mp3Blob = sampleInQueue.Mp3Blob,
                SampleMp3Blob = sampleInQueue.SampleMp3Blob,
                CreatedDate = sampleInQueue.CreatedDate,
                SampleDate = sampleInQueue.SampleDate,
                SampleMp3Url = sampleInQueue.SampleMp3Url
            };

            //add sample to table
            TableOperation insertOp = TableOperation.InsertOrMerge(sampleEntity);
            tableBinding.Execute(insertOp);
        }


        //Create a sample of specified duration
        private static void CreateSample(Stream input, Stream output, int duration)
        {
            using (var reader = new Mp3FileReader(input, wave => new NLayer.NAudioSupport.Mp3FrameDecompressor(wave)))
            {
                Mp3Frame frame;
                frame = reader.ReadNextFrame();
                int frameTimeLength = (int)(frame.SampleCount / (double)frame.SampleRate * 1000.0);
                int framesRequired = (int)(duration / (double)frameTimeLength * 1000.0);

                int frameNumber = 0;
                while ((frame = reader.ReadNextFrame()) != null)
                {
                    frameNumber++;

                    if (frameNumber <= framesRequired)
                    {
                        output.Write(frame.RawData, 0, frame.RawData.Length);
                    }
                    else break;
                }
            }
        }
    }
}

