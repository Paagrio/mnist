using System;

namespace NeuralNetwork
{
    [Serializable]
    public class Info
    {
        public double MaxError { get; set; }
        public double Classificated { get; set; }
        public int Count { get; set; }

        public int[] Data { get; set; }

        public int Label { get; set; }

        public int Output { get; set; }

        public Info()
        {
            MaxError = 0.0;
            Classificated = 0.0;
            Count = 0;
            Label = -1;
            Output = 0;
            Data = new int[28];
        }
    }
}
