
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

    public async Task SendData(int hidLayerSize, double speed, int weights, string actFunc)
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
            var nn = new NeuralNetwork.NeuralNetwork(28 * 28, hidLayerSize, 10, speed, activation, weights);
            nn.InitNetwork();
            int magic1 = brImages.ReadInt32(); // магическое число 
            int numImages = brImages.ReadInt32(); //количество изображений 
            int numRows = brImages.ReadInt32(); //количество строк в изображении 
            int numCols = brImages.ReadInt32(); //количество столбцов изображения 
            int magic2 = brLabels.ReadInt32(); //магическое число 
            int numLabels = brLabels.ReadInt32(); //количество лейблов 

            byte[] pixels = new byte[28 * 28]; //инициализация массива для хранения изображения 28x28 

            for (int di = 0; di < 60000; ++di)
            {
                byte lbl = brLabels.ReadByte(); //текущее значение лейбла 
                for (int i = 0; i < 28 * 28; ++i)
                {
                    byte b = brImages.ReadByte();
                    pixels[i] = b; //считываем байт изображения в массив 
                }
                nn.TrainNetwork(pixels, lbl);
                if ((di + 1) % 50 == 0)
                {
                    await Clients.Caller.SendAsync("ReceiveStepInfo", nn.GetInfo());
                    await Clients.Caller.SendAsync("ReceiveResultInfo", nn.GetResult());
                }
            }
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
