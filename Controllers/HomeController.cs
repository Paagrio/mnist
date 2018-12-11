using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
[Route("api/home")]
public class SampleDataController : Controller
{
    [HttpPost("upload")]
    public FileResult UploadImage()
    {
        using (var fs = new FileStream("test.png", FileMode.Create))
        {
            Request.Body.CopyTo(fs);
        }
        return File(System.IO.File.ReadAllBytes("test1.png"), "image/png", false);
    }
}
