import React, { Component } from "react";

//firebase
import { db } from "../../../../config/firebase";
import { Link } from "react-router-dom";

class AddUser extends Component {
  state = {
   title:''
  };

 
  //getting values in state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.title === "") {
      return false;
    }

    db.collection("tasks")
      .add({
        title: this.state.title
      })
      .then(docRef => {
        this.props.history.push("/all_tasks");
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  render() {
    return (
      <div className="outer">
        <Link
          to="/all_tasks"
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `100vh`
          }}
        ></Link>
        <div className="inner">
          <form method="get" onSubmit={this.handleSubmit}>
            <div className="">
              <input
                placeholder="Task"
                name="title"
                onChange={this.handleChange}
              />
            </div>
            <div className="">
              <button
              
              className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none">
                Add Task Field
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddUser;
