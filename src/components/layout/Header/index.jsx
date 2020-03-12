//dependicies
import React, { Component } from 'react';


//images
import logo from "../../../images/logo.png";

class Header extends Component {
  render() {
    return (
      <div className="bg-white">
        <div className="container px-3 py-8 flex justify-center items-center mx-auto">
          <a target="_top" href="https://collateralmanagement.org/timeclock/">
            <img className="h-20" alt="logo" src={logo} />
          </a>
        </div>
      </div>
    );
  }
}

export default Header;
