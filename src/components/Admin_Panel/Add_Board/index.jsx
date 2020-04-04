import React, { Component } from "react";
import { db } from "../../../config/firebase";
class Add_Board extends Component {
  state={
    board: ""
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.board === "") {
      return false;
    }

    db.collection("collections")
      .add({
        name: this.state.board
      })
      .then(docRef => {
        this.props.history.goBack();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };
  render() {
    return (
      <div className="outer">
        <div
          onClick={this.props.history.goBack}
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `100vh`
          }}
        ></div>
        <div className="inner">
          <form onSubmit={this.handleSubmit}>
            <div className="">
              <input
                placeholder="New Board"
                name="board"
                onChange={this.handleChange}
              />
            </div>
            <div>
              <button className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none">
                Add Board
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Add_Board;
