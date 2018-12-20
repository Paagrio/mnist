import React, { Component } from "react";

export class Home extends Component {
  constructor() {
    super();
    this.isPainting = false;
    this.canvas = null;
    this.ctx = null;
    this.oldX = 0;
    this.oldY = 0;
    this.state = {
      result: ""
    }
  }

  componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 15;
    this.ctx.strokeStyle = "white";
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

  sendData = (vector) => {
    fetch("api/home/upload", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vector)
    }).then((res) => {
      this.setState({ result: res.json()[0] });
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    let img = new Image();
    img.onload = () => {
      let canvas = document.getElementById('canvas1');
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 28, 28);
      ctx.ImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 28, 28);
      let imageData = ctx.getImageData(0, 0, 28, 28).data;
      let vector = [];
      for (let i = 0; i < imageData.length; i += 4) {
        vector.push(imageData[i]);
      }
      console.log(vector);
      this.sendData(vector);
    }
    img.src = this.canvas.toDataURL();
  };

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let canvas = document.getElementById('canvas1');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 28, 28);
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
              height: "280px",
              background: "black"
            }}
            width={280}
            height={280}
          />
          <canvas
            id="canvas1"
            style={{
              border: "1px solid black",
              width: "28px",
              height: "28px",
              background: "black"
            }}
            width={28}
            height={28}
          />
          <button onClick={this.clearCanvas}>Clear</button>
          <input type="submit" value="send" />
        </form>
        <div>
          {this.state.result}
        </div>
      </div>
    );
  }
}
