using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading.Tasks;

namespace NeuralNetwork
{
    [Serializable]
    public class NeuralNetwork
    {
        private double maxError = 0;
        private double success = 0;

        private int dataCount = 0;
        private ActivationFunction activationFunction;
        private double learningRate;
        private int inputVectorRange;
        private int hidLayerSize;
        private int outLayerSize;

        private DigitInfo[] digitInfo;

        Info information = new Info();
        private List<Layer> Layers;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="inputVectorRange">Размер входного слоя</param>
        /// <param name="hidLayerSize"> Размер скрытого слоя</param>
        /// <param name="outLayerSize"> Размер выходного слоя</param>
        /// <param name="learningRate"> Интенсивность обучения</param>
        /// <param name="activationFunction"> Функиця активации</param>
        /// <param name="weightSeed"> Веса будут инициализированы в диапазоне (-weightsSeed,weightsSeed)</param>
        public NeuralNetwork(int inputVectorRange, int hidLayerSize, int outLayerSize, double learningRate, ActivationFunction activationFunction)
        {
            this.inputVectorRange = inputVectorRange;
            this.hidLayerSize = hidLayerSize;
            this.outLayerSize = outLayerSize;
            this.learningRate = learningRate;
            this.activationFunction = activationFunction;
            digitInfo = new DigitInfo[10];
            for (int i = 0; i < 10; i++)
            {
                digitInfo[i] = new DigitInfo { Digit = i };
            }
        }

        /// <summary>
        /// Инициализирует сеть.
        /// </summary>
        public void InitNetwork()
        {
            Random rnd = new Random();
            Layers = new List<Layer>();

            Layer hiddLayer = new Layer(LayerType.HIDDEN);
            for (int a = 0; a < hidLayerSize; a++)
            {
                Neuron neuron = new Neuron();
                neuron.Output = 0.00;
                neuron.Inputs = new double[inputVectorRange];
                neuron.Weights = new double[inputVectorRange];
                for (int b = 0; b < inputVectorRange; b++)
                {
                    neuron.Inputs[b] = 0.00;
                    neuron.Weights[b] = 0.00;
                }
                neuron.Bias = 1;
                hiddLayer.Neurons.Add(neuron);
            }
            Layers.Add(hiddLayer);

            Layer outLayer = new Layer(LayerType.OUTPUT);
            for (int a = 0; a < outLayerSize; a++)
            {
                Neuron neuron = new Neuron();
                neuron.Output = 0.00;
                neuron.Inputs = new double[hidLayerSize];
                neuron.Weights = new double[hidLayerSize];
                for (int b = 0; b < hidLayerSize; b++)
                {
                    neuron.Inputs[b] = 0.00;
                    neuron.Weights[b] = 0.00;
                }
                neuron.Bias = 1;
                outLayer.Neurons.Add(neuron);
            }
            Layers.Add(outLayer);
        }
        /// <summary>
        /// инициализация сети из файла
        /// </summary>
        /// <param name="path">Путь к файлу</param>
        public void InitNetwork(string path)
        {
            InitNetwork(LoadNetwork(path));
        }

        /// <summary>
        /// Инициализирует сеть данными из другой сети
        /// </summary>
        /// <param name="nn">Нейронная сеть</param>
        private void InitNetwork(NeuralNetwork nn)
        {
            this.Layers = nn.Layers;
            this.learningRate = nn.learningRate;
            this.outLayerSize = nn.outLayerSize;
            this.inputVectorRange = nn.inputVectorRange;
            this.outLayerSize = nn.outLayerSize;
            this.activationFunction = nn.activationFunction;
        }

        /// <summary>
        /// Обучение сети
        /// </summary>
        /// <param name="data">Вектор входных значений</param>
        /// <param name="lbl">Истинное значение</param>
        /// <returns>Результат классификации</returns>
        public void TrainNetwork(byte[] data, int lbl)
        {
            this.information.Label = lbl;
            this.information.Data = data.Select(Convert.ToInt32).ToArray();
            maxError = -1.0;
            double[] inputVector = GetInputVector(lbl);
            ForwardPropagate(DataToVector(data));
            BackPropagate(lbl);
            int classificated = GetClassification();
            information.Output = classificated;
            digitInfo[lbl].Scatter[classificated]++;
            if (classificated == lbl)
            {
                success++;
                digitInfo[lbl].Success++;
            }
            dataCount++;
            digitInfo[lbl].Count++;
        }

        /// <summary>
        /// Тестирование сети без обратного распространения ошибки
        /// </summary>
        /// <param name="data">вектор входных значений</param>
        /// <returns>классифицированное значение 0-9</returns>
        public int TestNetwork(byte[] data)
        {
            ForwardPropagate(data.Select(Convert.ToDouble).ToArray());
            return GetClassification();
        }

        public Info GetInfo()
        {

            information.Classificated = Math.Round(success / dataCount * 100.00, 2);
            information.MaxError = maxError;
            information.Count = dataCount;
            return information;
        }

        /// <summary>
        /// Метод обратного распространения ошибки
        /// </summary>
        /// <param name="target">Истинное значение</param>
        private void BackPropagate(int target)
        {
            double weightsDelta = 0;
            Layer oLayer = Layers.Where(x => x.LayerType == LayerType.OUTPUT).First();
            for (int i = 0; i < oLayer.Neurons.Count; i++)
            {
                double output = oLayer.Neurons[i].Output;
                int targetOutput = i == target ? 1 : 0;
                double error = targetOutput - output;
                if (error > maxError)
                {
                    maxError = error;
                }
                switch (activationFunction)
                {
                    case ActivationFunction.Sigmoid:
                        weightsDelta = error * Sigmoiddx(output);
                        break;
                    case ActivationFunction.Tanh:
                        weightsDelta = error * Tanhdx(output);
                        break;
                }
                UpdateWeights(oLayer, i, weightsDelta);
            }
            oLayer = Layers.Where(x => x.LayerType == LayerType.HIDDEN).First();
            for (int i = 0; i < oLayer.Neurons.Count; i++)
            {
                double output = oLayer.Neurons[i].Output;
                int targetOutput = i == target ? 1 : 0;
                double error = targetOutput - output;
                if (error > maxError)
                {
                    maxError = error;
                }
                switch (activationFunction)
                {
                    case ActivationFunction.Sigmoid:
                        weightsDelta = error * Sigmoiddx(output);
                        break;
                    case ActivationFunction.Tanh:
                        weightsDelta = error * Tanhdx(output);
                        break;
                }
                UpdateWeights(oLayer, i, weightsDelta);
            }
        }
        /// <summary>
        /// Классификация
        /// </summary>
        /// <returns>Классифицированное значение</returns>
        private int GetClassification()
        {
            Layer oLayer = Layers.Where(x => x.LayerType == LayerType.OUTPUT).First();
            double max = 0.00;
            int maxIndex = 0;
            for (int i = 0; i < oLayer.Neurons.Count; i++)
            {
                if (oLayer.Neurons[i].Output > max)
                {
                    max = oLayer.Neurons[i].Output;
                    maxIndex = i;
                }
            }
            return maxIndex;
        }

        /// <summary>
        /// обновление весов
        /// </summary>
        /// <param name="layer">Слой</param>
        /// <param name="nodeId">Индекс нейрона</param>
        /// <param name="error">Ошибка</param>
        private void UpdateWeights(Layer layer, int nodeId, double error)
        {
            for (int j = 0; j < layer.Neurons[nodeId].Weights.Length; j++)
            {
                layer.Neurons[nodeId].Weights[j] += learningRate * error * layer.Neurons[nodeId].Inputs[j];
            }
            layer.Neurons[nodeId].Bias += learningRate * 1 * error;
        }

        /// <summary>
        /// Расчет выходных сигналов
        /// </summary>
        /// <param name="data">входной вектор</param>
        private void ForwardPropagate(double[] data)
        {

            TrainHiddenLayer(Layers[0], data);
            TrainOutputLayer(Layers[1]);
        }
        /// <summary>
        /// Активация скрытого слоя
        /// </summary>
        /// <param name="layer">слой</param>
        /// <param name="data">вектор входных значений</param>
        private void TrainHiddenLayer(Layer layer, double[] data)
        {
            for (int i = 0; i < layer.Neurons.Count; i++)
            {
                TrainNeuron(layer.Neurons[i], data);
            }
        }

        public DigitInfo[] GetResult()
        {
            return digitInfo;
        }

        /// <summary>
        /// Активация нейрона
        /// </summary>
        /// <param name="neuron">Нейрон</param>
        /// <param name="data">Вектор входных значений</param>
        private void TrainNeuron(Neuron neuron, double[] data)
        {
            neuron.Output = neuron.Bias;
            for (int i = 0; i < neuron.Inputs.Length; i++)
            {
                neuron.Inputs[i] = data[i];
                neuron.Output += neuron.Inputs[i] * neuron.Weights[i];
            }
            switch (activationFunction)
            {
                case ActivationFunction.Sigmoid:
                    neuron.Output = Sigmoid(neuron.Output);
                    break;
                case ActivationFunction.Tanh:
                    neuron.Output = Tanh(neuron.Output);
                    break;
            }
        }

        /// <summary>
        /// Активация выходного слоя
        /// </summary>
        /// <param name="layer">слой</param>
        private void TrainOutputLayer(Layer layer)
        {
            double[] input = GetOutputVector(Layers[0]);
            for (int i = 0; i < layer.Neurons.Count; i++)
            {
                TrainNeuron(layer.Neurons[i], input);
            }
        }

        /// <summary>
        /// Получение вектора по цифре. Пример: 3 = [0,0,0,1,0,0,0,0,0,0]
        /// </summary>
        /// <param name="lbl">Цифра</param>
        /// <returns></returns>
        private double[] GetInputVector(int lbl)
        {
            double[] input = new double[10];
            for (int i = 0; i < 10; i++)
            {
                input[i] = lbl == i ? 1 : 0;
            }
            return input;
        }
        /// <summary>
        /// Получение вектора значений выходных сигналов слоя
        /// </summary>
        /// <param name="l">Слой</param>
        /// <returns>Вектор значений</returns>
        private double[] GetOutputVector(Layer l)
        {
            double[] vector = new double[l.Neurons.Count];
            for (int i = 0; i < l.Neurons.Count; i++)
            {
                vector[i] = l.Neurons[i].Output;
            }
            return vector;
        }

        /// <summary>
        /// Сохранить текущее состояние сети.
        /// </summary>
        /// <param name="path">Путь к файлу формат .dat</param>
        public async void SaveNetwork(string path)
        {
            BinaryFormatter formatter = new BinaryFormatter();
            using (FileStream fs = new FileStream(path, FileMode.OpenOrCreate))
            {
                await Task.Run(() => formatter.Serialize(fs, this));
            }
        }

        private NeuralNetwork LoadNetwork(string path)
        {
            BinaryFormatter formatter = new BinaryFormatter();
            NeuralNetwork nn;
            using (FileStream fs = new FileStream(path, FileMode.Open))
            {
                nn = formatter.Deserialize(fs) as NeuralNetwork;
            }
            return nn;
        }

        private double[] DataToVector(byte[] pixels)
        {
            double[] vector = new double[pixels.Length];
            for (int i = 0; i < pixels.Length; i++)
            {
                vector[i] = pixels[i] / 255.00;
            }
            return vector;
        }

        private double Random(double min, double max) => new Random().NextDouble() * (max - min) + min;

        private double Sigmoid(double value) => 1.00 / (1.00 + Math.Exp(-value));
        private double Sigmoiddx(double value) => value * (1 - value);

        private double Tanh(double value) => Math.Tanh(value);
        private double Tanhdx(double value) => 1 - Math.Pow(Math.Tanh(value), 2);

    }
}
