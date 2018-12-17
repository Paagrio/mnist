import React, { Component } from "react";

export class Home extends Component {
  constructor() {
    super();
    this.isPainting = false;
    this.canvas = null;
    this.ctx = null;
    this.oldX = 0;
    this.oldY = 0;
  }

  componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 5;
  }

  handleMouseDown = e => {
    this.isPainting = true;
    this.oldX = e.clientX - this.canvas.getBoundingClientRect().left;
    this.oldY = e.clientY - this.canvas.getBoundingClientRect().top;
  };

  handleMouseMove = e => {
    e.preventDefault();
    if (this.isPainting) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.oldX, this.oldY);
      this.ctx.lineTo(
        e.clientX - this.canvas.getBoundingClientRect().left,
        e.clientY - this.canvas.getBoundingClientRect().top
      );
      this.ctx.stroke();
      this.oldX = e.clientX - this.canvas.getBoundingClientRect().left;
      this.oldY = e.clientY - this.canvas.getBoundingClientRect().top;
    }
  };

  handleMouseUp = () => {
    this.isPainting = false;
  };

  handleSubmit = e => {
    e.preventDefault();
    let img = new Image();
    img.onload = e => {
      img.width = 28;
      img.height = 28;
      this.ctx.drawImage(img, 0, 0, 28, 28, 0, 0, 28, 28);
    };
    img.src = this.canvas.toDataURL();
    console.log(img);
  };

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  render() {
    return (
      <div>
        <form
          action="POST"
          onSubmit={this.handleSubmit}
          encType="multipart/form-data"
        >
          <canvas
            id="canvas"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={() => {
              this.isPainting = false;
            }}
            style={{
              border: "1px solid black",
              width: "280px",
              height: "280px"
            }}
            width={280}
            height={280}
          />
          <button onClick={this.clearCanvas}>Clear</button>
          <input type="submit" value="send" />
        </form>
      </div>
    );
  }
}
