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
      <div style={{ display: "flex", flexDirection: "column", margin:"5px" }}>
        <label>{"Количество: " + this.props.step.count}</label>
        <label>
          {"Успешно распознано: " + this.props.step.classificated + "%"}
        </label>
        <table>
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
              let percent = ((obj.success / obj.count) * 100).toFixed(2);
              return (
                <tr key={index}>
                  <td>{obj.digit}</td>
                  <td>{obj.count}</td>
                  <td>
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
