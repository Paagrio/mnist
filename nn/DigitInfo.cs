using System.Collections.Generic;

namespace NeuralNetwork
{
    public class DigitInfo
    {
        public int Digit { get; set; }
        public int Success { get; set; } = 0;
        public int Count { get; set; } = 0;
        public Dictionary<int, int> Scatter { get; set; } = new Dictionary<int, int>()
        {
            {0,0},
            {1,0},
            {2,0},
            {3,0},
            {4,0},
            {5,0},
            {6,0},
            {7,0},
            {8,0},
            {9,0}
        };
    }
}