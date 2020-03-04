//dependicies
import React, { Component } from "react";

import { AuthContext } from "../../context/AuthContext";
//components
import Table from "../Table";
import Button from '../utils/Button'

class Home extends Component {
  static contextType = AuthContext;
  render() {
    return (
      <div className="container mx-auto py-16">
        <Button
            link="/admin-login"
            name={this.context.isAuthenticated ? "Sign OUT" : "Sign IN"}
          />
        <Table />
      </div>
    );
  }
}

export default Home;
