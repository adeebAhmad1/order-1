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
    goal: {}
  };
  handleDropdown2 = (e)=>{
    if(e.target.id === "icon") return;
    document.querySelector(".emoji-mart").classList.remove("block")
  }
  componentWillUnmount(){
    window.removeEventListener("click",this.handleDropdown2);
  }
  componentDidMount = () => {
    window.addEventListener("click",this.handleDropdown2);
    //! for getting all goals
    db.collection("goals")
      .get()
      .then(querySnapshot => {
        let goal = {};
        querySnapshot.forEach(doc => {
          goal = { ...doc.data() };
          goal.id = doc.id;
          goal.state = true;
        });
        this.refs.goal.innerHTML = goal.title;
        this.setState({ goal });
      });
  };

  //! handle submit for Saving update goal
  Save = goalId => {
    const goal = {
      title: document.querySelector(".jodit_wysiwyg").innerHTML,
      time: new Date().getTime()
    };
    if (goalId)
      db.collection("goals").doc(goalId).update(goal).then(() => this.setState({ goal }));
    else
      db.collection("goals").add(goal).then(() => this.setState({ goal }));
  };

  render() {
    const config = {
      readonly: false
    };
    return (
      <div>
        {this.context.isAuthenticated ? (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                border: "2px solid",
                width: "60%",
                margin: "0 auto",
                position: `relative`
              }}
            >
              <Editor
                ref="goal"
                value={this.state.goal.title}
                config={config}
                tabIndex={1}
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
              id='icon'
              onClick={() => {
                document
                  .querySelector("section.emoji-mart")
                  .classList.toggle("block");
              }}
              style={{ position: `relative`, right: `15%`, color: "blue" }}
            >
              &nbsp;Emoji
            </i>
            <Picker
              style={{ position: `absolute`, left: "25%", top: "45%" }}
              title=""
              emoji=""
              onSelect={e => {
                document.querySelector(".jodit_wysiwyg").innerHTML += e.native;
              }}
            />
            <button
              style={{ position: `relative`, left: `17%` }}
              onClick={() => this.Save(this.state.goal.id)}
              className="rounded btn mt-1 px-4 py-2 text-center bg-blue-600 text-white cursor-pointer ml-3 outline-none"
            >
              Update
            </button>
          </div>
        ) : (
          <div style={{textAlign: "center",border: "2px solid",width: "100vh",margin: "0 auto",position: `relative`}}>
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
