using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using RIPA.Functions.Security;
using RIPA.Functions.TextAnalytics.Models;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.TextAnalytics.Functions
{
    public class PostCheckPii
    {
        private readonly IPiiTextAnalyticsService _piiTextAnalyticsService;
        public PostCheckPii(IPiiTextAnalyticsService piiTextAnalyticsService)
        {
            _piiTextAnalyticsService = piiTextAnalyticsService;
        }

        [FunctionName("PostCheckPii")]

        [OpenApiOperation(operationId: "PostCheckPii", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(PiiRequest), Deprecated = false, Description = "Document is the input string you would like to be analyzed", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(PiiResponse), Description = "Responds with a list of Pii Entities that may be PII and a redactiedText string. Uses Beta Nuget 5.1.0-beta.5")]

        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            try
            {
                if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
                {
                    return new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new UnauthorizedResult();
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string document = data?.Document;
            if (string.IsNullOrEmpty(document))
                document = data?.document;
            if (string.IsNullOrEmpty(document))
                return new BadRequestObjectResult("Must Provide Document");

            var piiEntities = await _piiTextAnalyticsService.GetPiiEntities(document);
            PiiResponse piiResponse = new PiiResponse() { RedactedText = piiEntities.RedactedText, PiiEntities = new List<PiiEntity>() };

            foreach (var entity in piiEntities.Where(x => x.ConfidenceScore > .75))
            {
                piiResponse.PiiEntities.Add(new PiiEntity
                {
                    EntityText = entity.Text,
                    ConfidenceScore = $"{entity.ConfidenceScore:F2}",
                    Category = entity.Category.ToString()
                });
            }

            return new OkObjectResult(piiResponse);
        }

        public class PiiResponse
        {
            public List<PiiEntity> PiiEntities { get; set; }
            public string RedactedText { get; set; }
        }

        public class PiiEntity
        {
            public string EntityText { get; set; }
            public string ConfidenceScore { get; set; }
            public string Category { get; set; }
        }
    }
}

