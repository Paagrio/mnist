using System.Collections.Generic;

namespace NeuralNetwork
{
    public class DigitInfo
    {
        public int Digit { get; set; }
        public int Success { get; set; } = 0;
        public int Count { get; set; } = 0;
        public int[] Scatter { get; set; } = new int[10];
    }
}