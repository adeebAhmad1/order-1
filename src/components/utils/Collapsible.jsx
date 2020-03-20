import React, { Component } from "react";
const colorArray = [
  "#FF6633",
  "#FF33FF",
  "#00B3E6",
  "#3366E6",
  "#999966",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#6680B3",
  "#66991A",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#E666B3",
  "#33991A",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#6666FF"
];
class Collapsible extends Component {
  state = {
    total: 0,
    stuck: 0
  };
  componentDidMount() {
    this.refs.accordion.addEventListener("click", () => {
      const panel = this.refs.panel;
      panel.classList.toggle("activePanel");
    });
    if (this.refs.accordion.textContent !== "New") {
      document.querySelector("#panel-0").classList.add("activePanel");
    }
    let total;
    setInterval(() => {
      const totalArr = Array.from(
        document.querySelectorAll(`#panel-${this.props.i} .commentBox`)
      ).map(el => el.textContent);
      total = eval(
        totalArr
          .toString()
          .split(",")
          .join("+")
      );
      this.setState({ total });
    }, 500);
    let stuck;
    setInterval(() => {
      const totalArr = Array.from(
        document.querySelectorAll(`#panel-${this.props.i} .status`)
      ).filter(el => el.textContent ==="Stuck");
      stuck = totalArr.length;
      this.setState({ stuck });
    }, 500);
  }
  render() {
    return (
      <div>
        <button
          className={`accordion relative ${this.props.active ? "active" : ""}`}
          ref="accordion"
          id={`accordion-${this.props.i}`}
          style={{ color: `${colorArray[this.props.i]}` }}
        >
          {this.props.date}
          <div
            className="absolute"
            style={{
              top: `50%`,
              right: `5%`,
              transform: `translate(5%,-50%)`
            }}
          >
            {this.props.length} Items &nbsp;
            {this.state.total} Comments &nbsp;
            {this.state.stuck} Stuck
          </div>
        </button>
        <div
          className={`panel ${this.props.active ? "activePanel" : ""}`}
          ref="panel"
          id={`panel-${this.props.i}`}
        >
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Collapsible;
