//dependicies
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
//components
import Goals from "../utils/goals";
import Table from "../Table";

//firebase
import firebase from "../../config/firebase";
import SideNav from "../utils/SideNav";

class Home extends Component {
  static contextType = AuthContext;
  state = {
    board: this.props.match.params.board
  };
  componentWillReceiveProps(props) {
    this.setState({ board: props.match.params.board });
  }
  render() {
    return (
      <div>
        <Goals />
        <SideNav page="home" board={this.state.board || "todos"} />
        <div className="container mx-auto py-16">
          {this.context.isAuthenticated ? (
            <Link
              className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
              onClick={() =>
                firebase
                  .auth()
                  .signOut()
                  .then(() => {})
                  .catch(error => {
                    // An error happened.
                    alert(error);
                  })
              }
              to="/"
            >
              Sign Out
            </Link>
          ) : (
            <Link
              className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
              to="/admin-login"
            >
              Admin Login
            </Link>
          )}
          <Table match={this.props.match} />
        </div>
      </div>
    );
  }
}

export default Home;
