import React, { Component, PureComponent } from "react";


export class Visual extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = e => {
        this.setState({ selected: e.target.value });
    };

    rgb = (value) => {
        let val = value;
        return 'rgb(${val},${val},${val}';
    }

    render() {
        if (this.props.data === null) return null;
        let data = this.props.data.data;
        console.log(this.props.data);
        let height = 280;
        let width = 280;
        return (
            <div style={{
                display: "flex",
                height: height,
                width: 280 + 500
            }}>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        minWidth: width,
                        minHeight: height,
                        maxWidth: width,
                        border: "1px solid black",
                    }}>
                    {data.map((obj, i) => {
                        let rgb = this.rgb();
                        return (
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    background: "rgb(" + obj + "," + obj + "," + obj + ")"
                                }}>
                            </div>
                        )
                    })}
                </div >
                <div style={{
                    margin: 30
                }}>
                    <h1>{"Распознано как: " + this.props.data.output}</h1>
                </div>
            </div>
        );
    }
}
