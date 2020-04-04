import React, { Component } from "react";

import { AuthContext } from "../../context/AuthContext";

//firebase
import { db } from "../../config/firebase";

import Editor from "jodit-react";

import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

class Goals extends Component {
  static contextType = AuthContext;
  state = {
    goal: {},
    board: this.props.board,
    caretPosition: 0
  };
  handleDropdown2 = e => {
    if (document.querySelector(".emoji-mart")) {
      if (e.target.id === "icon") return;
      if (
        e.target &&
        e.target.parentNode &&
        e.target.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode &&
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode.parentNode
      ) {
        if (
          e.target.classList.contains("emoji-mart") ||
          e.target.parentNode.classList.contains("emoji-mart") ||
          e.target.parentNode.parentNode.classList.contains("emoji-mart") ||
          e.target.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emoji-mart"
          )
        )
          return;
      }
      if (
        e.target &&
        e.target.parentNode &&
        e.target.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode
      )
        if (
          e.target.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.parentNode.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.parentNode.parentNode.classList.contains(
            "jodit_wysiwyg"
          )
        )
          return;
      document.querySelector(".emoji-mart").classList.remove("block");
    }
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.handleDropdown2);
  }
  componentDidMount = () => {
    this.setState({ board: this.props.board });
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

  render() {
    const config = {
      readonly: false
    };
    if(this.refs.goal){
      this.refs.goal.innerHTML = this.state.goal.title || "";
    }
    return (
      <div style={{position: `relative`}}>
        {this.context.isAuthenticated ? (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                backgroundColor: "#F5F6F8",
                width: "60%",
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
                  {new Date(this.state.goal.time).toLocaleTimeString()}{" "}
                  {new Date(this.state.goal.time).toDateString()}
                </p>
              ) : (
                ""
              )}
            </div>
            <i
              className="far fa-smile left"
              id="icon"
              onClick={() => {
                document.querySelector("section.emoji-mart").classList.toggle("block");
              }}
              style={{ position: `absolute`, left: "81%",bottom:`0`, color: "blue" }}
            ></i>
            <Picker
              style={{ position: `absolute`, left: "60%", top: "100%" }}
              title=""
              emoji=""
              onSelect={e => {
                const input = document.querySelector(".jodit_wysiwyg");
                input.focus();
                if (document.execCommand("insertText", false, e.native)) return;
                input.innerHTML += e.native;
              }}
            />
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
              padding: "10px",
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
                  {new Date(this.state.goal.time).toLocaleTimeString()}{" "}
                  {new Date(this.state.goal.time).toDateString()}
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