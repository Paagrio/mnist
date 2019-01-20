import React, { Component, PureComponent } from "react";


export class Diagram extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = e => {
        this.setState({ selected: e.target.value });
    };

    render() {
        if (this.props.data === null) return null;
        let height = 500;
        let width = 800;
        let data = this.props.data;
        let maxValue = Math.max.apply(null, Array.from(data, x => x.count));
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    minWidth: width,
                    minHeight: height,
                    border: "1px solid black",
                    fontFamily: "Palatino Linotype, Book Antiqua, Palatino, serif",
                    fontSize: 14
                }}
            >
                <div style={{
                    border: ":1px solid black",
                    display: "inline-flex",
                    position: "absolute",
                    justifySelf: "flex-start",
                    alignSelf: "flex-start",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                    minHeight: 50,
                    minWidth: 100
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                        <div style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            background: "#59ABE3"
                        }}>
                        </div>
                        <div style={{ marginLeft: 10 }}>
                            Общее количество
                </div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                        <div style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            background: "#F47983"
                        }}>
                        </div>
                        <div style={{ marginLeft: 10 }}>
                            Успешно распознано
                </div>
                    </div>
                </div>
                <div style={{
                    border: ":1px solid black",
                    position: "absolute",
                    justifySelf: "flex-start",
                    alignSelf: "flex-start"
                }}>

                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: 20,
                    minHeight: height - 100,
                    marginRight: 10,
                }}>
                    {[0, 1, 2, 3, 4].map((obj, index) => {
                        return (
                            <div>
                                {maxValue * 25 * (4 - index) / 100}
                            </div>
                        )
                    })}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-around",
                        background: "#f2f3f4",
                        minWidth: width - 100,
                        minHeight: height - 100,
                    }}
                >
                    <div style={{
                        display: "inline-flex",
                        position: "absolute",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "stretch",
                        minWidth: width - 100,
                        minHeight: height - 120,
                    }}>
                        {[0, 1, 2, 3, 4].map((obj, i) => {
                            return (
                                <div style={{
                                    height: 1,
                                    background: "lightgray",
                                    marginBottom: i === 4 ? -1 : 0,
                                }}></div>
                            )
                        })}
                    </div>

                    {data.map((obj, i) => {
                        let count = obj.count;
                        let digit = obj.digit;
                        let success = obj.success;
                        return (
                            <div style={{
                                display: "flex",
                                justifyContent: "stretch",
                                alignItems: "flex-end",
                                flexWrap: "wrap",
                                width: "40px",
                                zIndex: 101
                            }}>
                                <div
                                    style={{
                                        background: "#F47983",
                                        width: "50%",
                                        minHeight: Math.ceil(380 / maxValue * data[i].success),
                                    }}>
                                </div>
                                <div
                                    style={{
                                        background: "#59ABE3",
                                        width: "50%",
                                        minHeight: Math.ceil(380 / maxValue * data[i].count),
                                    }}>
                                </div>
                                <div style={{
                                    width: 40,
                                    height: 10,
                                    marginBottom: -15,
                                    textAlign: "center"

                                }}>
                                    {data[i].digit}
                                </div>
                            </div>
                        );
                    })}
                    {[0, 1, 2, 3, 4, 5].map((obj, indexer) => {

                    })}
                </div>
            </div >
        );
    }
}
