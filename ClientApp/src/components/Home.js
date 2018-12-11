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
    this.canvas.toBlob(blob => {
      fetch("api/home/upload", {
        method: "POST",
        body: blob
      }).then(res => {
        res.arrayBuffer().then(buffer => {
          var base64Flag = "data:image/png;base64,";
          var imageStr = this.arrayBufferToBase64(buffer);

          var img = new Image();
          img.src = base64Flag + imageStr;
          img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
          };
        });
      });
    });
  };

  arrayBufferToBase64 = buffer => {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach(b => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
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
              border: "1px solid black"
            }}
            width={280}
            height={280}
          />
          <input type="submit" value="send" />
        </form>
      </div>
    );
  }
}
