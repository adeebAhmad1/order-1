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
      document.querySelector(".emoji-mart").classList.remove("block");
    }
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.handleDropdown2);
  }
  printCaretPosition = (e, elm) => {
    this.refs.caretPosition.value = this.getCaretCharOffset(elm);
    console.log(this.refs.caretPosition.value)
  };
  getCaretCharOffset = element => {
    var caretOffset = 0;

    if (window.getSelection) {
      var range = window.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    } else if (document.selection && document.selection.type !== "Control") {
      var textRange = document.selection.createRange();
      var preCaretTextRange = document.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  };
  abcd=()=>{
    document.querySelector(".jodit_wysiwyg").focus()
    setTimeout(()=>{
      const event = new KeyboardEvent("keypress",{
        metaKey: true,
        key: ".",
        code: "Period"
      });
      document.querySelector(".jodit_wysiwyg").dispatchEvent(event)
    },1000)
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
        setTimeout(() => {
          const elm = document.querySelector(".jodit_wysiwyg");
          elm.addEventListener("click", e => this.printCaretPosition(e, elm));
          elm.addEventListener("keydown", e => this.printCaretPosition(e, elm));
        }, 700);
      });
  };
  componentWillReceiveProps(props) {
    this.setState({ board: props.board });
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
    return (
      <div>
        <input type="text" style={{display: `none`}} defaultValue="0" ref="caretPosition" />
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
                onChange={(e)=>console.log(e)}
                onBlur={(e)=>console.log(e)}
              />
              {this.state.goal.time ? (
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
                const input = document.querySelector(".jodit_wysiwyg");
                let textFinding;
                textFinding = input.textContent.slice(this.refs.caretPosition.value,+this.refs.caretPosition.value+5)
                let index = input.innerHTML.indexOf(textFinding);
                if(index === -1) textFinding = input.textContent.slice(+this.refs.caretPosition.value-5,+this.refs.caretPosition.value);
                index = input.innerHTML.indexOf(textFinding)
                input.innerHTML = input.innerHTML.slice(0,index) + e.native + input.innerHTML.slice(index) 
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
            {this.state.goal.time ? (
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

