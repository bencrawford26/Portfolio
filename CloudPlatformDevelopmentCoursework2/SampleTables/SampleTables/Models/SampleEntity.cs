// Entity class for Azure table
using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace SampleTables.Models
{

    public class SampleEntity : TableEntity
    {
        public string Title { get; set; }
        public string Artist { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Mp3Blob { get; set; }
        public string SampleMp3Blob { get; set; }
        public string SampleMp3Url { get; set; }
        public Nullable <DateTime> SampleDate { get; set; }

        public SampleEntity(string partitionKey, string productID)
        {
            PartitionKey = partitionKey;
            RowKey = productID;
        }

        public SampleEntity() { }

    }
}
