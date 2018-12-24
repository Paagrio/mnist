using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NeuralNetwork;

[Route("api/home")]
public class SampleDataController : Controller
{
    public SampleDataController()
    {

    }

    [HttpPost("upload")]
    public JsonResult UploadVector([FromBody]byte[] vector)
    {
        var nn = new NeuralNetwork.NeuralNetwork(784, 20, 10, 0.1, ActivationFunction.Sigmoid, 0.1);
        nn.InitNetwork("test.dat");
        int result = nn.TestNetwork(vector);
        return Json(result);
    }
}
