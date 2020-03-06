import React, { Component } from "react";

//firebase
import { db } from "../../../config/firebase";
import { Link } from "react-router-dom";

class EditUser extends Component {
  state = {
    name: "",
    url: ""
  };

  //getting values in state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (userId, e) => {
    e.preventDefault();
    let name = this.state.name;
    let url = this.state.url;
    db.collection("users")
      .doc(userId)
      .update({
        name,
        url
      })
      .then(() => {
        this.props.history.push("/all_user");
        console.log("Document successfully updated!");
      });
  };

  render() {
    return (
      <div className="outer">
        <Link
          to="/all_user"
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `100vh`
          }}
        ></Link>

        <div className="inner">
          <form
            method="get"
            onSubmit={e => this.handleSubmit(this.props.match.params.userId, e)}
          >
            <div className="">
              <input
                placeholder="Name"
                name="name"
                onChange={this.handleChange}
              />
            </div>
            <div className="">
              <input
                placeholder="Image URL"
                name="url"
                onChange={this.handleChange}
              />
            </div>
            <div className="">
              <button className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditUser;
