using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Configuration;
using SampleTables.Models;

namespace SampleTables.Migrations
{
    public static class InitialiseSamples
    {
        public static void go()
        {
            const String partitionName = "Samples_Partition_1";

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureWebJobsStorage"].ToString());

            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            CloudTable table = tableClient.GetTableReference("Samples");

            DateTime now = DateTime.Now;

            // If table doesn't already exist in storage then create and populate it with some initial values, otherwise do nothing
            if (!table.Exists())
            {
                // Create table if it doesn't exist already
                table.CreateIfNotExists();

                // Create the batch operation.
                TableBatchOperation batchOperation = new TableBatchOperation();

                // Create a sample entity and add it to the table.
                SampleEntity sample1 = new SampleEntity(partitionName, "1");
                sample1.Title = "Aqualung";
                sample1.Artist = "Jethro Tull";
                sample1.CreatedDate = now;
                sample1.Mp3Blob = null;
                sample1.SampleMp3Blob = null;
                sample1.SampleMp3Url = null;
                sample1.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample2 = new SampleEntity(partitionName, "2");
                sample2.Title = "Songs from the wood";
                sample2.Artist = "Jethro Tull";
                sample2.CreatedDate = now;
                sample2.Mp3Blob = null;
                sample2.SampleMp3Blob = null;
                sample2.SampleMp3Url = null;
                sample2.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample3 = new SampleEntity(partitionName, "3");
                sample3.Title = "Wish you were here";
                sample3.Artist = "Pink Floyd";
                sample3.CreatedDate = now;
                sample3.Mp3Blob = null;
                sample3.SampleMp3Blob = null;
                sample3.SampleMp3Url = null;
                sample3.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample4 = new SampleEntity(partitionName, "4");
                sample4.Title = "Still Life";
                sample4.Artist = "Van der Graaf Generator";
                sample4.CreatedDate = now;
                sample4.Mp3Blob = null;
                sample4.SampleMp3Blob = null;
                sample4.SampleMp3Url = null;
                sample4.SampleDate = now;


                // Create another sample entity and add it to the table.
                SampleEntity sample5 = new SampleEntity(partitionName, "5");
                sample5.Title = "Musical Box";
                sample5.Artist = "Genesis";
                sample5.CreatedDate = now;
                sample5.Mp3Blob = null;
                sample5.SampleMp3Blob = null;
                sample5.SampleMp3Url = null;
                sample5.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample6 = new SampleEntity(partitionName, "6");
                sample6.Title = "Supper's Ready";
                sample6.Artist = "Genesis";
                sample6.CreatedDate = now;
                sample6.Mp3Blob = null;
                sample6.SampleMp3Blob = null;
                sample6.SampleMp3Url = null;
                sample6.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample7 = new SampleEntity(partitionName, "7");
                sample7.Title = "Starship Trooper";
                sample7.Artist = "Yes";
                sample7.CreatedDate = now;
                sample7.Mp3Blob = null;
                sample7.SampleMp3Blob = null;
                sample7.SampleMp3Url = null;
                sample7.SampleDate = now;

                // Create another sample entity and add it to the table.
                SampleEntity sample8 = new SampleEntity(partitionName, "8");
                sample8.Title = "Levitation";
                sample8.Artist = "Hawkwind";
                sample8.CreatedDate = now;
                sample8.Mp3Blob = null;
                sample8.SampleMp3Blob = null;
                sample8.SampleMp3Url = null;
                sample8.SampleDate = now;

                // Add product entities to the batch insert operation.
                batchOperation.Insert(sample1);
                batchOperation.Insert(sample2);
                batchOperation.Insert(sample3);
                batchOperation.Insert(sample4);
                batchOperation.Insert(sample5);
                batchOperation.Insert(sample6);
                batchOperation.Insert(sample7);
                batchOperation.Insert(sample8);

                // Execute the batch operation.
                table.ExecuteBatch(batchOperation);
            }

        }
    }
}