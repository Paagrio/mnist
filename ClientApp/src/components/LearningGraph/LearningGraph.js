import React, { Component, PureComponent } from "react";
import "./LearningGraph.css";

export class LearningGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      colors: [
        "rgb(255,0,0)",
        "rgb(255,255,0)",
        "rgb(0,255,0)",
        "rgb(0,255,255)",
        "rgb(0,0,255)",
        "rgb(255,0,255)",
        "rgb(120,123,120)",
        "rgb(120,78,200)",
        "rgb(120,200,78)",
        "rgb(70,100,255)"
      ]
    };
  }

  handleChange = e => {
    this.setState({ selected: e.target.value });
  };

  render() {
    if (this.props.data === null) return null;
    let data = this.props.data;
    let percents = [];
    let offsets = [];
    let percentsSum = 0;
    for (let i = 0; i < 10; i++) {
      percents.push(
        (data[this.state.selected].scatter[i] /
          this.props.data[this.state.selected].count) *
          100
      );
      percentsSum -= percents[i];
      offsets.push(100 - percentsSum);
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        <select value={this.state.selected} onChange={this.handleChange}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width={300}
          height={300}
          style={{
            border: "1px solid black",
            background: "rgb(240,240,240)"
          }}
        >
          <text
            x={150}
            y={20}
            style={{ font: "20px sans-serif" }}
            textAnchor="middle"
          >
            Диаграмма распределения
          </text>
          {this.props.data[this.state.selected].scatter.map((obj, index) => {
            return (
              <React.Fragment key={index}>
                <circle
                  name={obj.toString()}
                  cx={40}
                  cy={30}
                  r={15.91549430918954}
                  stroke={this.state.colors[index]}
                  fill="transparent"
                  strokeDasharray={
                    percents[index].toString() +
                    " " +
                    (100 - percents[index]).toString()
                  }
                  strokeDashoffset={offsets[index]}
                  strokeWidth="5"
                  style={{
                    transform: "scale(5)"
                  }}
                  onMouseEnter={e => {
                    console.log(e.target.name);
                  }}
                />
                <circle
                  cx={60}
                  cy={(index + 1) * 25 + 20}
                  r={10}
                  fill={this.state.colors[index]}
                  style={{ transform: "scale(1)" }}
                />
                <text
                  x={75}
                  y={(index + 1) * 25 + 28}
                  style={{ font: "20px sans-serif" }}
                >
                  {index.toString()}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    );
  }
}
