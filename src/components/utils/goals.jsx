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
    board: this.props.board
  };
  handleDropdown2 = e => {
    if (e.target.id === "icon") return;
    if(
      e.target.classList.contains("emoji-mart")||
      e.target.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.parentNode.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("emoji-mart")||
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("emoji-mart") ||
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("emoji-mart")
    ) return;
    document.querySelector(".emoji-mart").classList.remove("block");
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.handleDropdown2);
  }
  
  componentDidMount = () => {
    this.setState({board: this.props.board})
    window.addEventListener("click", this.handleDropdown2);
    //! for getting all goals
    db.collection("goals")
      .get()
      .then(querySnapshot => {
        const goals = [];
        querySnapshot.forEach(doc => {
          const goal = doc.data();
          goal.id = doc.id;
          if(!goal.board) goal.board = "todos"
          goals.push(goal);
        });
        const goal = goals.find(goal=> goal.board === this.state.board);
        if(goal){
          this.refs.goal.innerHTML = goal.title;
          this.setState({ goal });
        }
      });
  };
  componentWillReceiveProps(props){
    this.setState({board: props.board})
  }
  //! handle submit for Saving update goal
  Save = goalId => {
    const goal = {
      title: document.querySelector(".jodit_wysiwyg").innerHTML,
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
    return (
      <div>
        {this.context.isAuthenticated ? (
          <div style={{ margin: "0 auto", textAlign: "center", }}>
            <div
              style={{
                backgroundColor: "#F5F6F8",
                width: "60%",
                margin: "0 auto",
                position: `relative`
              }}
            >
              <Editor
              style={{backgroundColor: "#F5F6F8",border:"none"}}
                ref="goal"
                value={this.state.goal.title}
                config={config}
                tabIndex={1}
              />
            </div>
            <i
              className="far fa-smile left"
              id="icon"
              onClick={() => {
                document
                  .querySelector("section.emoji-mart")
                  .classList.toggle("block");
              }}
              style={{ position: `absolute`,left:'20%', color: "blue" }}
            ></i>
            <Picker
              style={{ position: `absolute`, left: "20%", top: "45%" }}
              title=""
              emoji=""
              onSelect={e => {
                document.querySelector(".jodit_wysiwyg").innerHTML += e.native;
              }}
            />
            <button
              style={{ position: `relative`, left: `23%` }}
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
              width: "100vh",
              margin: "0 auto",
              position: `relative`
            }}
          >
            <p ref="goal"></p>
          </div>
        )}
      </div>
    );
  }
}

export default Goals;
