import React, { Component, PureComponent } from "react";
import "./ResultInfo.css";

export class ResultInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      view: false
    };
  }

  changeView = e => {
    this.setState({ view: !this.state.view });
  };

  render() {
    if (this.props.data === null) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>{"Эпоха: " + this.props.step.count}</label>
        <label>
          {"Успешно распознано: " + this.props.step.classificated + "%"}
        </label>
        <table border="1">
          <thead>
            <tr>
              <td>Цифра</td>
              <td>Количество</td>
              <td onClick={this.changeView} style={{ cursor: "pointer" }}>
                Успешно
              </td>
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((obj, index) => {
              let color;
              let percent = ((obj.success / obj.count) * 100).toFixed(2);
              if (percent < 70) {
                color = "red";
              }
              if (percent > 70) {
                color = "#f45555";
              }
              if (percent > 80) {
                color = "#fce449";
              }
              if (percent > 90) {
                color = "#6cfc64";
              }
              if (percent > 95) {
                color = "green";
              }
              return (
                <tr key={index}>
                  <td>{obj.digit}</td>
                  <td>{obj.count}</td>
                  <td
                    style={{
                      background: color === null ? "red" : color
                    }}
                  >
                    {this.state.view ? percent + "%" : obj.success}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
