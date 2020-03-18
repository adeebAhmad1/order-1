import React, { Component } from "react";

class Collapsible extends Component {
  componentDidMount() {
    this.refs.accordion.addEventListener("click", e => {
      e.target.classList.toggle("active");
      const panel = this.refs.panel;
      panel.classList.toggle("activePanel")
    });
    if(this.refs.accordion.textContent !== "New"){
      document.querySelector("#accordion-0").classList.add("active");
      document.querySelector("#panel-0").classList.add("activePanel");
    }
  }
  render() {
    return (
      <div>
        <button className={`accordion ${this.props.active ? "active" : ""}`} ref="accordion" id={`accordion-${this.props.i}`}>
          {this.props.date}
        </button>
        <div className={`panel  ${this.props.active ? "activePanel" : ""}`} ref="panel" id={`panel-${this.props.i}`}>
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Collapsible;
