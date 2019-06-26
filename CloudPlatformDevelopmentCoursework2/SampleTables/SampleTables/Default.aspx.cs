using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using SampleTables.Controllers;
using SampleTables.Models;
using System;
using System.Configuration;
using System.IO;
using System.Linq;

using TagLib;

// Remember: code behind is run at the server.

namespace Mp3Previews
{
    public partial class _Default : System.Web.UI.Page
    {
        // accessor variables and methods for blob containers and queues
        private BlobStorageService _blobStorageService = new BlobStorageService();
        private CloudQueueService _queueStorageService = new CloudQueueService();

        private CloudStorageAccount storageAccount;
        private CloudTableClient tableClient;
        private CloudTable table;

        public _Default()
        {
            storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureStorage"].ToString());
            tableClient = storageAccount.CreateCloudTableClient();
            table = tableClient.GetTableReference("Samples");
        }

        private CloudBlobContainer getMp3GalleryContainer()
        {
            return _blobStorageService.getCloudBlobContainer();
        }

        private CloudQueue getPreviewMakerQueue()
        {
            return _queueStorageService.getCloudQueue();
        }

        //Get content type (MP3)
        private string GetMimeType(string Filename)
        {
            try
            {
                string ext = Path.GetExtension(Filename).ToLowerInvariant();
                Microsoft.Win32.RegistryKey key = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
                if (key != null)
                {
                    string contentType = key.GetValue("Content Type") as String;
                    if (!String.IsNullOrEmpty(contentType))
                    {
                        return contentType;
                    }
                }
            }
            catch
            {
            }
            return "application/octet-stream";
        }

        private string getMp3Title(Uri blobURI)
        {
            CloudBlockBlob blob = new CloudBlockBlob(blobURI);
            blob.FetchAttributes();
            return blob.Metadata["Title"];
        }
        // User clicked the "Submit" button
        protected void submitButton_Click(object sender, EventArgs e)
        {
            if (upload.HasFile)
            {
                // Get the file name specified by the user. 
                var ext = Path.GetExtension(upload.FileName);
                var data = Path.GetFileNameWithoutExtension(upload.FileName);
                

                // Add more information to it so as to make it unique
                // within all the files in that blob container
                var name = string.Format("{0}{1}", Guid.NewGuid(), ext);

                // Upload photo to the cloud. Store it in a new 
                // blob in the specified blob container. 

                // Go to the container, instantiate a new blob
                // with the descriptive name
                String path = "mp3s/" + name;

                var blob = getMp3GalleryContainer().GetBlockBlobReference(path);

                // The blob properties object (the label on the bucket)
                // contains an entry for MIME type. Set that property.
                blob.Properties.ContentType = GetMimeType(upload.FileName);

                // Actually upload the data to the
                // newly instantiated blob
                blob.UploadFromStream(upload.FileContent);
                blob.FetchAttributes();
                blob.Metadata["Title"] = data;
                blob.Metadata["Artist"] = data;
                blob.SetMetadata();

                //Create new sample
                SampleEntity entity = new SampleEntity()
                {
                    RowKey = getNewMaxRowKeyValue(),
                    PartitionKey = SampleController.partitionName,
                    Title = data,
                    Artist = data,
                    SampleMp3Blob = null,
                    SampleMp3Url = null,
                    SampleDate = DateTime.Now,
                    Mp3Blob = path,
                    CreatedDate = DateTime.UtcNow
                };

                //create insert operation
                var insertOperation = TableOperation.Insert(entity);

                //run insert operation
                table.Execute(insertOperation);

                // Place a message in the queue to tell the worker
                // role that a new photo blob exists, which will 
                // cause it to create a preview blob of that photo
                // for easier display. 
                getPreviewMakerQueue().AddMessage(new CloudQueueMessage(System.Text.Encoding.UTF8.GetBytes(name)));
                getPreviewMakerQueue().AddMessage(new CloudQueueMessage(JsonConvert.SerializeObject(entity)));

                System.Diagnostics.Trace.WriteLine(String.Format("*** WebRole: Enqueued '{0}'", path));
            }
        }

        //Get the next row key lue after the last entry
        private String getNewMaxRowKeyValue()
        {
            TableQuery<SampleEntity> query = new TableQuery<SampleEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Samples_Partition_1"));

            int maxRowKeyValue = 0;
            foreach (SampleEntity entity in table.ExecuteQuery(query))
            {
                int entityRowKeyValue = Int32.Parse(entity.RowKey);
                if (entityRowKeyValue > maxRowKeyValue) maxRowKeyValue = entityRowKeyValue;
            }
            maxRowKeyValue++;
            return maxRowKeyValue.ToString();
        }

        //refresh page
        protected void refreshButton_Click(object sender, EventArgs e)
        {
            Page.Response.Redirect(Page.Request.Url.ToString(), false);
        }

        // rerun every timer click - set by timer control on aspx page to be every 1000ms
        protected void Page_PreRender(object sender, EventArgs e)
        {
            try
            {
                // Look at blob container that contains the previews
                // generated by the worker role. Perform a query
                // of the its contents and return the list of all of the
                // blobs whose name begins with the string "previews". 
                // It returns an enumerator of their URLs. 
                // Place that enumerator into list view as its data source. 
                PreviewDisplayControl.DataSource = from o in getMp3GalleryContainer().GetDirectoryReference("previews").ListBlobs()
                                                   select new { Url = o.Uri, Title = getMp3Title(o.Uri) };
                // Tell the list view to bind to its data source, thereby
                // showing 
                PreviewDisplayControl.DataBind();
            }
            catch (Exception)
            {
            }
        }
    }
}
