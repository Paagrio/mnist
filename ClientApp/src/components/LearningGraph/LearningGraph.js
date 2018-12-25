import React, { Component, PureComponent } from "react";
import "./LearningGraph.css";

export class LearningGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvas = null;
    this.ctx = null;
  }

  componentDidMount() { }

  render() {
    if (this.props.data === null) return null;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
        style={{ width: "100px", height: "100px" }}>
        <rect x="0" y="0" width="20" height="20" style={{ background: "black" }} />
      </svg>
    );
  }
}
