// This is a Data Transfer Object (DTO) class. This is sent/received in REST requests/responses.
// Read about DTOS here: https://docs.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5

using System;
using System.ComponentModel.DataAnnotations;

namespace SampleTables.Models
{
    public class Sample
    {
        /// <summary>
        /// Sample ID
        /// </summary>
        [Key]
        public string SampleID { get; set; }

        /// <summary>
        /// Title of sample
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Name of artist
        /// </summary>
        public string Artist { get; set; }

        /// <summary>
        /// Creation date/time of entity
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Name of uploaded blob in blob storage
        /// </summary>
        public string Mp3Blob { get; set; }

        /// <summary>
        /// Name of sample blob in blob storage
        /// </summary>
        public string SampleMp3Blob { get; set; }

        /// <summary>
        /// Web service resource URL of mp3 sample
        /// </summary>
        public string SampleMp3Url { get; set; }

        /// <summary>
        /// Creation date/time of sample blob
        /// </summary>
        public Nullable <DateTime> SampleDate { get; set; }
    }
}