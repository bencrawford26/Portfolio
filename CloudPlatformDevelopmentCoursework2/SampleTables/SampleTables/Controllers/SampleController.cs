using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using SampleTables.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace SampleTables.Controllers
{
    public class SampleController : ApiController
    {
        public const String partitionName = "Samples_Partition_1";

        private CloudStorageAccount storageAccount;
        private CloudTableClient tableClient;
        private CloudTable table;

        public SampleController()
        {
            storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureWebJobsStorage"].ToString());
            tableClient = storageAccount.CreateCloudTableClient();
            table = tableClient.GetTableReference("Samples");
        }
        

        /// <summary>
        /// Get all Samples
        /// </summary>
        /// <returns></returns>
        // GET: api/Sample
        public IEnumerable<Sample> Get()
        {
            TableQuery<SampleEntity> query = new TableQuery<SampleEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionName));
            List<SampleEntity> entityList = new List<SampleEntity>(table.ExecuteQuery(query));

            // Basically create a list of Sample from the list of SampleEntity with a 1:1 object relationship, filtering data as needed
            IEnumerable<Sample> SampleList = from e in entityList
                                               select new Sample()
                                               {
                                                   SampleID = e.RowKey,
                                                   Title = e.Title,
                                                   Artist = e.Artist,
                                                   CreatedDate = e.CreatedDate,
                                                   Mp3Blob = e.Mp3Blob,
                                                   SampleMp3Blob = e.SampleMp3Blob,
                                                   SampleMp3Url = e.SampleMp3Url,
                                                   SampleDate = e.SampleDate
                                               };
            return SampleList;
        }

        // GET: api/Sample/5
        /// <summary>
        /// Get a Sample
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(Sample))]
        public IHttpActionResult GetSample(string id)
        {
            // Create a retrieve operation that takes a Sample entity.
            TableOperation getOperation = TableOperation.Retrieve<SampleEntity>(partitionName, id);

            // Execute the retrieve operation.
            TableResult getOperationResult = table.Execute(getOperation);

            // Construct response including a new DTO as apprporiatte
            if (getOperationResult.Result == null) return NotFound();
            else
            {
                SampleEntity SampleEntity = (SampleEntity)getOperationResult.Result;
                Sample p = new Sample()
                {
                    SampleID = SampleEntity.RowKey,
                    Title = SampleEntity.Title,
                    Artist = SampleEntity.Artist,
                    CreatedDate = SampleEntity.CreatedDate,
                    Mp3Blob = SampleEntity.Mp3Blob,
                    SampleMp3Blob = SampleEntity.SampleMp3Blob,
                    SampleMp3Url = SampleEntity.SampleMp3Url,
                    SampleDate = SampleEntity.SampleDate
                };
                return Ok(p);
            }
        }

        // POST: api/Sample
        /// <summary>
        /// Create a new Sample
        /// </summary>
        /// <param name="Sample"></param>
        /// <returns></returns>
        [ResponseType(typeof(Sample))]
        public IHttpActionResult PostSample(Sample Sample)
        {
            SampleEntity SampleEntity = new SampleEntity()
            {
                RowKey = getNewMaxRowKeyValue(),
                PartitionKey = partitionName,
                Title = Sample.Title,
                Artist = Sample.Artist,
                CreatedDate = Sample.CreatedDate,
                Mp3Blob = Sample.Mp3Blob,
                SampleMp3Blob = Sample.SampleMp3Blob,
                SampleMp3Url = Sample.SampleMp3Url,
                SampleDate = Sample.SampleDate
            };

            // Create the TableOperation that inserts the Sample entity.
            var insertOperation = TableOperation.Insert(SampleEntity);

            // Execute the insert operation.
            table.Execute(insertOperation);

            return CreatedAtRoute("DefaultApi", new { id = SampleEntity.RowKey }, SampleEntity);
        }

        // PUT: api/Sample/5
        /// <summary>
        /// Update a Sample
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Sample"></param>
        /// <returns></returns>
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSample(string id, Sample Sample)
        {
            if (id != Sample.SampleID)
            {
                return BadRequest();
            }

            // Create a retrieve operation that takes a Sample entity.
            TableOperation retrieveOperation = TableOperation.Retrieve<SampleEntity>(partitionName, id);

            // Execute the operation.
            TableResult retrievedResult = table.Execute(retrieveOperation);

            // Assign the result to a SampleEntity object.
            SampleEntity updateEntity = (SampleEntity)retrievedResult.Result;

            deleteOldBlobs(updateEntity);

            updateEntity.Title = Sample.Title;
            updateEntity.Artist = Sample.Artist;
            updateEntity.CreatedDate = Sample.CreatedDate;
            updateEntity.Mp3Blob = Sample.Mp3Blob;
            updateEntity.SampleMp3Blob = Sample.SampleMp3Blob;
            updateEntity.SampleMp3Url = Sample.SampleMp3Url;
            updateEntity.SampleDate = Sample.SampleDate;

            // Create the TableOperation that inserts the Sample entity.
            // Note semantics of InsertOrReplace() which are consistent with PUT
            // See: https://stackoverflow.com/questions/14685907/difference-between-insert-or-merge-entity-and-insert-or-replace-entity
            var updateOperation = TableOperation.InsertOrReplace(updateEntity);

            // Execute the insert operation.
            table.Execute(updateOperation);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public void deleteOldBlobs(SampleEntity sample)
        { }

        // DELETE: api/Sample/5
        /// <summary>
        /// Delete a Sample
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(Sample))]
        public IHttpActionResult DeleteSample(string id)
        {
            // Create a retrieve operation that takes a Sample entity.
            TableOperation retrieveOperation = TableOperation.Retrieve<SampleEntity>(partitionName, id);

            // Execute the retrieve operation.
            TableResult retrievedResult = table.Execute(retrieveOperation);
            if (retrievedResult.Result == null) return NotFound();
            else
            {
                SampleEntity deleteEntity = (SampleEntity)retrievedResult.Result;
                TableOperation deleteOperation = TableOperation.Delete(deleteEntity);

                // Execute the operation.
                table.Execute(deleteOperation);

                return Ok(retrievedResult.Result);
            }
        }

        private String getNewMaxRowKeyValue()
        {
            TableQuery<SampleEntity> query = new TableQuery<SampleEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionName));

            int maxRowKeyValue = 0;
            foreach (SampleEntity entity in table.ExecuteQuery(query))
            {
                int entityRowKeyValue = Int32.Parse(entity.RowKey);
                if (entityRowKeyValue > maxRowKeyValue) maxRowKeyValue = entityRowKeyValue;
            }
            maxRowKeyValue++;
            return maxRowKeyValue.ToString();
        }


    }
}
