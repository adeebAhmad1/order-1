import React, { Component } from "react";
import firebase from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
class Forgot extends Component {
  static contextType = AuthContext;
  state = {
    password: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    var user = firebase.auth().currentUser;
    var newPassword = this.state.password;
    user
      .updatePassword(newPassword)
      .then(() => {
        // Update successful.
        this.props.history.push('/admin_panel/todos')
      })
      .catch(error => {
        // An error happened.
        console.error(error);
      });
  };
  render() {
    return (
      <div className="container mx-auto">
        <div
          className="bg-white shadow w-64 mt-20 p-6 mx-auto"
          style={{ width: `483px` }}
        >
          <h1 className="text-lg text-purple-600 mb-12 text-center font-bold text-3xl">
            Change Password
          </h1>
          <form onSubmit={this.handleSubmit}>
            <input
              className="shadow w-full text-md mb-6 p-3"
              type="password"
              placeholder="New Password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <button
              className="px-5 py-2 text-md bg-purple-600 text-white mr-0 ml-auto rounded-lg outline-none"
              id="login_btn"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Forgot;
