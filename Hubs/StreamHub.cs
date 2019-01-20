
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using NeuralNetwork;

public class StreamHub : Hub
{
    FileStream ifsLabels;//поток для чтения лейблов 
    FileStream ifsImages; // test images 

    BinaryReader brLabels;
    BinaryReader brImages;

    public async Task SendData(int hidLayerSize, double speed, string actFunc)
    {
        ActivationFunction activation = ActivationFunction.Sigmoid;
        switch (actFunc)
        {
            case "sigmoid":
                activation = ActivationFunction.Sigmoid;
                break;
            case "tanh":
                activation = ActivationFunction.Tanh;
                break;
        }
        try
        {
            ifsLabels = new FileStream("train-labels.idx1-ubyte", FileMode.Open);//поток для чтения лейблов 
            ifsImages = new FileStream("train-images.idx3-ubyte", FileMode.Open); // test images
            brLabels = new BinaryReader(ifsLabels);
            brImages = new BinaryReader(ifsImages);
            var nn = new NeuralNetwork.NeuralNetwork(28 * 28, hidLayerSize, 10, speed, activation);
            nn.InitNetwork();
            int magic1 = brImages.ReadInt32();
            int numImages = brImages.ReadInt32();
            int numRows = brImages.ReadInt32();
            int numCols = brImages.ReadInt32();

            int magic2 = brLabels.ReadInt32();
            int numLabels = brLabels.ReadInt32();

            byte[] pixels = new byte[28 * 28];

            for (int di = 0; di < 60000; ++di)
            {
                byte lbl = brLabels.ReadByte();
                for (int i = 0; i < 28 * 28; ++i)
                {
                    byte b = brImages.ReadByte();
                    pixels[i] = b;
                }
                nn.TrainNetwork(pixels, lbl);
                var info = nn.GetInfo();
                if (info.Count % 50 == 0)
                {
                    await Clients.Caller.SendAsync("ReceiveStepInfo", info);
                    await Clients.Caller.SendAsync("ReceiveResultInfo", nn.GetResult());
                    Thread.Sleep(100);
                }
            }
            nn.SaveNetwork("test.dat");
            await Clients.Caller.SendAsync("EndLearning");
            ifsImages.Close();
            brImages.Close();
            ifsLabels.Close();
            brLabels.Close();
        }
        catch (Exception)
        {
            ifsImages.Close();
            brImages.Close();
            ifsLabels.Close();
            brLabels.Close();
        }
    }
}
