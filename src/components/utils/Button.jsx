//dependicies
import React, { Component } from "react";
import {Link } from "react-router-dom";


class Button extends Component {
  render() {
    return (
            <Link
             style={{
              paddingTop: "10px"
            }}
            className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
               to={this.props.link}
            >{this.props.name}</Link>
    );
  }
}

export default Button;
