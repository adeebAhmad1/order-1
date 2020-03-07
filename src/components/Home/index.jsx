//dependicies
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
//components
import Table from "../Table";

//firebase
import firebase from "../../config/firebase";

class Home extends Component {
  static contextType = AuthContext;
  render() {
    return (
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
        <Table />
      </div>
    );
  }
}

export default Home;
