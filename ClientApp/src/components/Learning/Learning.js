import React, { Component } from "react";
import { HubConnectionBuilder } from "@aspnet/signalr";
import "./Learning.css";
import { ResultInfo } from "../ResultInfo/ResultInfo";
import { ScatterPlot } from "../ScatterPlot/ScatterPlot";
import { LearningGraph } from "../LearningGraph/LearningGraph";
import { Diagram } from "../Diagram/Diagram";
import { Visual } from "../Visual/Visual";

export class Learning extends Component {
  constructor() {
    super();
    this.state = {
      connection: null,
      hidLayerSize: 20,
      learningRate: 0.1,
      activationFunc: "sigmoid",
      result: null,
      stepResult: null,
      isLearning: true
    };
  }

  componentDidMount() {
    let conn = new HubConnectionBuilder().withUrl("/stream").build();

    conn.on("ReceiveStepInfo", data => {
      this.setState({ stepResult: data });
    });
    conn.on("ReceiveResultInfo", data => {
      this.setState({ result: data });
    });
    conn.on("EndLearning", () => {
      this.setState({ isLearning: false });
    });
    conn.start().catch(err => {
      return console.error(err.toString());
    });
    this.setState({ connection: conn, isLearning: false });
  }

  handleSubmit = () => {
    this.setState({ isLearning: true });
    this.state.connection
      .invoke(
        "SendData",
        +this.state.hidLayerSize,
        +this.state.learningRate,
        this.state.activationFunc
      )
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const result = this.state.result;
    const stepResult = this.state.stepResult;
    const hub = this.state.connection;
    return (
      <div className="learning">
        <div className="head">
          <h1>Обучение нейросети методом обратного распространения ошибки</h1>
        </div>
        {this.state.isLearning ? null : (
          <div className="form">
            <label>Количество нейронов в скрытом слое</label>
            <input
              type="text"
              className="input"
              name="hidLayerSize"
              value={this.state.hidLayerSize}
              onChange={this.handleChange}
            />
            <label>Скорость обучения</label>
            <input
              type="text"
              className="input"
              name="learningRate"
              value={this.state.learningRate}
              onChange={this.handleChange}
            />
            <label>Функция активации</label>
            <select
              value={this.state.activationFunc}
              name="activationFunc"
              onChange={this.handleChange}
            >
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
            </select>
            <input
              type="button"
              onClick={this.handleSubmit}
              className="submit"
              value="Обучение"
            />
          </div>
        )}
        <ResultInfo data={result} step={stepResult} hub={hub} />
        <ScatterPlot data={result} />
        <LearningGraph data={result} />
        <Diagram data={result} />
        <Visual data={stepResult} />
      </div>
    );
  }
}
