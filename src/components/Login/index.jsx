import React, { Component } from "react";
import firebase from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";

class Login extends Component {
  static contextType = AuthContext;
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount() {
    if (this.props.location) {
      firebase
        .auth()
        .signOut()
        .then(() => {})
        .catch(error => {});
    }
  }
  handleSubmit = e => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push("/admin_panel");
      })
      .catch(error => {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
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
            Login
          </h1>

          <form onSubmit={this.handleSubmit}>
            <input
              className="shadow w-full text-md mb-6 p-3"
              type="email"
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <input
              className="shadow w-full text-md mb-6 p-3"
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <button
              className="px-5 py-2 text-md bg-purple-600 text-white mr-0 ml-auto rounded-lg outline-none"
              id="login_btn"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
