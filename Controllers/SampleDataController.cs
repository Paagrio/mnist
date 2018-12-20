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
  NeuralNetwork.NeuralNetwork nn;

  public SampleDataController()
  {
    nn = new NeuralNetwork.NeuralNetwork(784, 20, 10, 0.1);
    nn.LoadNetwork("nn.dat");
  }

  [HttpPost("upload")]
  public ActionResult UploadVector([FromBody]double[] vector)
  {
    int result = nn.TestNetwork(vector);
    return Ok(result);
  }
}
