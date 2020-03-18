import React, { Component } from "react";

class Collapsible extends Component {
  state={
    total: 0
  }
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
      this.setState({total})
    }, 500);
  }
  render() {
    return (
      <div>
        <button
          className={`accordion relative ${this.props.active ? "active" : ""}`}
          ref="accordion"
          id={`accordion-${this.props.i}`}
        >
          {this.props.date}
          <div
            className="absolute"
            style={{
              top: `50%`,
              right: `10%`,
              transform: `translate(10%,-50%)`
            }}
          >
            {this.props.length} Items &nbsp;
            {this.state.total} Comments
          </div>
        </button>
        <div
          className={`panel  ${this.props.active ? "activePanel" : ""}`}
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
