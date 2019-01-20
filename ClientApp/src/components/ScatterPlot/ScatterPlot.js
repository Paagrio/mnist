import React, { Component, PureComponent } from "react";
import "./ScatterPlot.css";

export class ScatterPlot extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvas = null;
    this.ctx = null;
  }

  render() {
    if (this.props.data === null) return null;
    return (
      <table>
        <caption>Таблица сопряженности</caption>
        <thead>
          <tr>
            <td />
            {this.props.data.map((obj, index) => {
              return <td key={index}>{obj.digit}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((obj, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                {this.props.data.map((obj, ind) => {
                  let bg=null;
                  if (ind == index) {
                    bg = "#a3b7fa";
                  }
                  return (
                    <td key={ind} style={{background:bg}}>
                      {this.props.data[index].scatter[ind]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
