using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NRC.Reveal.KoTables.Models {
    public class Breadcrumb {
        public string Description { get; set; }
        public string Link { get; set; }

        public Breadcrumb(string description, string link) {
            Description = description;
            Link = link;
        }
    }
}
