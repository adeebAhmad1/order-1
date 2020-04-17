import React, { Component } from "react";

import { AuthContext } from "../../context/AuthContext";

//firebase
import { db } from "../../config/firebase";

import Editor from "jodit-react";

import EmojiBox from "./EmojiBoard"

class Goals extends Component {
  static contextType = AuthContext;
  state = {
    goal: {},
    board: this.props.board,
    caretPosition: 0
  };
  componentDidMount = () => {
    this.setState({ board: this.props.board });
      //! for getting all goals
      db.collection("goals")
        .get()
        .then(querySnapshot => {
          const goals = [];
          querySnapshot.forEach(doc => {
            const goal = doc.data();
            goal.id = doc.id;
            if (!goal.board) goal.board = "todos";
            goals.push(goal);
          });
          const goal = goals.find(goal => goal.board === this.state.board);
          if (goal) {
            this.refs.goal.innerHTML = goal.title;
            this.setState({ goal });
          }
        });
  };
  UNSAFE_componentWillReceiveProps(props) {
    if(props.board !== this.state.board){
      this.setState({ board: props.board });
      window.addEventListener("click", this.handleDropdown2);
      //! for getting all goals
      db.collection("goals")
        .get()
        .then(querySnapshot => {
          const goals = [];
          querySnapshot.forEach(doc => {
            const goal = doc.data();
            goal.id = doc.id;
            if (!goal.board) goal.board = "todos";
            goals.push(goal);
          });
          const goal = goals.find(goal => goal.board === this.state.board);
          if (goal) {
            this.refs.goal.innerHTML = goal.title;
            this.setState({ goal });
          }
        });
      this.setState({ board: props.board });
    }
  }
  //! handle submit for Saving update goal
  Save = goalId => {
    const goal = {
      title: document.querySelector(".jodit_wysiwyg").innerHTML,
      time: new Date().getTime(),
      board: this.state.board
    };
    if (goalId)
      db.collection("goals")
        .doc(goalId)
        .update(goal)
        .then(() => this.setState({ goal }));
    else
      db.collection("goals")
        .add(goal)
        .then(() => this.setState({ goal }));
  };

  addEmoji = (e,emoji)=>{
    e.preventDefault()
    const input = document.querySelector(".jodit_wysiwyg");
    if (document.execCommand("insertText", false, emoji)) return;
    input.focus()
    input.innerHTML += emoji;
  }
  render() {
    const config = {
      readonly: false
    };
    if(this.refs.goal){
      this.refs.goal.innerHTML = this.state.goal.title || "";
    }
    return (
      <div style={{position: `relative`}} className="container mx-auto">
        {this.context.isAuthenticated ? (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                backgroundColor: "#F5F6F8",
                width: "99%",
                margin: "0 auto",
                position: `relative`
              }}
            >
              <Editor
                style={{ backgroundColor: "#F5F6F8", border: "none" }}
                ref="goal"
                value={this.state.goal.title}
                config={config}
                tabIndex={1}
              />
              {this.state.goal.time ? (
                this.state.goal.title === "" ? ""
                :
                <p style={{ color: "grey", fontSize: "12px" }}>
                  {" "}
                  Posted By <b>Admin</b> on{" "}
                  {new Date(this.state.goal.time).toLocaleTimeString() + " " + new Date(this.state.goal.time).toDateString()}
                </p>
              ) : (
                ""
              )}
            </div>
            <EmojiBox addEmoji={this.addEmoji}  />
            <button
              style={{ position: `absolute`, left: `50%` }}
              onClick={() => this.Save(this.state.goal.id)}
              className="rounded btn mt-1 px-4 py-2 text-center bg-blue-600 text-white cursor-pointer ml-3 outline-none"
            >
              Update
            </button>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#F5F6F8",
              // padding: "20px",
              width: "60%",
              margin: "0 auto",
              position: `relative`
            }}
          >
            <p className="jodit_wysiwyg" ref="goal"></p>
            {this.state.goal.time ? (
                this.state.goal.title === "" ? ""
                :
                <p style={{ color: "grey", fontSize: "12px" }}>
                  {" "}
                  Posted By <b>Admin</b> on{" "}
                  {new Date(this.state.goal.time).toLocaleTimeString() + " " + new Date(this.state.goal.time).toDateString()}
                </p>
              ) : (
                ""
              )}
          </div>
        )}
      </div>
    );
  }
}

export default Goals;