using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;

namespace NRC.Reveal.KoTables.Controllers
{
    public class DataController : ApiController
    {
        public HttpResponseMessage GetData(string id) {
            string filename = HostingEnvironment.MapPath(string.Format("~/Data/{0}.json", id));
            var rdr = new StreamReader(filename);
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StreamContent(rdr.BaseStream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            return response;
        }
    }
}
