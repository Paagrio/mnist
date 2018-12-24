namespace NeuralNetwork
{
    public class Info
    {
        public double MaxError { get; set; }
        public double Classificated { get; set; }
        public int Count { get; set; }

        public Info()
        {
            MaxError = 0.0;
            Classificated = 0.0;
            Count = 0;
        }
    }
}
