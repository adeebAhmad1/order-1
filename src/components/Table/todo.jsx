import React, { Component } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import img from "../../images/no_image.jpg";
//! firebase
import { db } from "../../config/firebase";

class Todo extends Component {
  state = {
    id: null,
    users: [],
    status: `Not Started`,
    endTime: ``,
    iTimes: 0,
    confettiStart: false,
    time: ``,
    user: {}
  };
  stopTimer = () => {
    const endTime = this.state.endTime
      ? this.state.endTime
      : new Date().getTime();
    if (!this.props.endTime) {
      db.collection("todos")
        .doc(this.props.url)
        .update({ endTime })
        .then(() => this.setState({ endTime }));
    }
  };
  // ! update status function
  updateStatus = todosId => {
    let status = this.refs.status.innerText;
    db.collection("todos")
      .doc(todosId)
      .update({
        status
      })
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.removeDropdown2);
  }
  removeDropdown2 = e => {
    if (e.target.id === "dropdown1") return false;
    this.refs.dropdown1.classList.remove("block");
  };
  UNSAFE_componentWillReceiveProps () {
    var text = this.refs.status.textContent;    
    this.setState({ endTime: this.props.endTime,status:text });
    this.state.status = text;
    if (this.state.status === "Done") {
      this.refs.status_wrapper.style.backgroundColor = "#03C977";
      this.refs.dropdown1.classList.add("invisible");
      this.updateTime();
      this.stopTimer();
    } else if (this.state.status === "Stuck") {
      this.refs.status_wrapper.style.backgroundColor = "#E1445B";
      if (this.state.iTimes === 0) this.updateTime();
    } else if (this.state.status === "Working on It") {
      this.refs.status_wrapper.style.backgroundColor = "#F7AE3C";
      if (this.state.iTimes === 0) this.updateTime();
    } else if (this.state.status === "Not Started") {
      this.refs.status_wrapper.style.backgroundColor = "#599EFD";
    }
  }
  componentWillUpdate(){
    if (this.state.status === "Done") {
      this.refs.status_wrapper.style.backgroundColor = "#03C977";
    } else if (this.state.status === "Stuck") {
        this.refs.status_wrapper.style.backgroundColor = "#E1445B";
    } else if (this.state.status === "Working on It") {
      this.refs.status_wrapper.style.backgroundColor = "#F7AE3C";
      if (this.state.iTimes === 0) this.updateTime();
    } else if (this.state.status === "Not Started") {
      this.refs.status_wrapper.style.backgroundColor = "#599EFD";
    }
  }
  //! getting users from fatabase
  componentDidMount = () => {
    this.setState({commentsLength:this.props.commentsLength})
    db.collection("users")
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          let user = doc.data();
          user.id = doc.id;
          users.push(user);
        });
        window.addEventListener("click", this.removeDropdown2);
        const user = users.find(el => el.id === this.props.userId) || {};
        this.setState({ users, user });
      });
  };

  //show timer for users
  updateTime = () => {
    const timer = this.props.timer ? this.props.timer : new Date().getTime();
    this.setState({ iTimes: 1 });
    setInterval(() => {
      const now = this.state.endTime
        ? this.state.endTime
        : new Date().getTime();
      const remainingTime = now - timer;
      const seconds = Math.floor(remainingTime / 1000);
      const mins = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if(remainingMins >= 0 && remainingSeconds >= 0){
        this.setState({
          time: `${hours < 10 ? "0" + hours : hours}:${
            remainingMins < 10 ? "0" + remainingMins : remainingMins
          }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`
        });
      } else{
        this.setState({time: `00:00:00`})
      }
    }, 1000);
  };
  //status dropdown
  handleDropdown = id => {
    const status_priority_dropdown = document.querySelectorAll(
      ".status_priority_wrapper > .status_priority_dropdown"
    );
    if (this.state.id !== id) {
      for (let i = 0; i < status_priority_dropdown.length; i++) {
        status_priority_dropdown[i].style.display = "none";
      }
    }
    status_priority_dropdown[id].classList.toggle("block");
    const status_priority_wrapper = document.querySelector(
      `.status_priority_wrapper${id}`
    );
    for (
      let i = 0;
      i < status_priority_dropdown[id].querySelectorAll("li").length;
      i++
    ) {
      status_priority_dropdown[id]
        .querySelectorAll("li")
        [i].addEventListener("click", e => {
          var text = e.target.innerText;
          this.setState({ status: text });
          if (this.state.status === "Done") {
            this.setState({
              confettiStart: true
            });
            status_priority_wrapper.style.backgroundColor = "#48bb77";
            status_priority_wrapper.children[0].innerText = "Done";
            this.updateTime()
            this.stopTimer();
          } else if (this.state.status === "Stuck") {
            status_priority_wrapper.children[0].innerText = "Stuck";
            status_priority_wrapper.style.backgroundColor = "#E1445B";
            this.updateTime();
            const timer = this.props.timer
              ? this.props.timer
              : new Date().getTime();
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                timer
              })
              .then(() => {
                window.location.reload()
              });
            if (this.props.commentsLength === 0) {
              status_priority_wrapper.style.backgroundColor = "#E1445B";
            }
          } else if (this.state.status === "Working on it") {
            status_priority_wrapper.children[0].innerText = "Working on It";
            status_priority_wrapper.style.backgroundColor = "#d69e2e";
            this.updateTime();
            const timer = this.props.timer
              ? this.props.timer
              : new Date().getTime();
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                timer
              }).then(()=> window.location.reload())
          } else if (this.state.status === "Not Started") {
            status_priority_wrapper.children[0].innerText = "Not Started";
            status_priority_wrapper.style.backgroundColor = "#599EFD";
          }
          if (this.props.todoId) {
            this.updateStatus(this.props.todoId);
          }
        });
    }
    this.setState({ id });
  };
  render() {
    return (
      <tr className="bg-gray-100 border-b border-gray-100">
        <td className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container">
          {this.props.title}
          <Link
            to={`/home/comments/${this.props.url}`}
            className="relative chat-wrapper cursor-pointer"
          >
            <i style={{color: this.props.commentsLength > 0 ? `#2b6cb0` : `#a0aec0`}} className="text-3xl text-gray-500 chat-icon far fa-comment"></i>
            <div  style={{backgroundColor: this.props.commentsLength > 0 ? `#2b6cb0` : `#a0aec0`}} className="w-4 h-4 rounded-full text-xs bg-gray-500 text-white absolute bottom-0 right-0 pointer-events-none">
              {(this.props.commentsLength)}
            </div>
          </Link>
          <Confetti
            numberOfPieces={1000}
            recycle={false}
            run={this.state.confettiStart}
          />
        </td>
        <td style={{ position: "relative" }}>
          <div
            className="h-full bg-cover rounded-full mx-auto "
            style={{
              width: "40px",
              backgroundImage: `url(${this.state.user.url || img})`,
              backgroundPosition: `center`
            }}
          ></div>
        </td>
        <td
          ref="status_wrapper"
          className={`bg-green-500 text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index)}
        >
          <p ref="status" id="dropdown1">
            {this.props.status}
          </p>
          <ul
            ref="dropdown1"
            className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown"
          >
            {this.state.status === "Not Started" ? (
              <li className="select1 border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
                <span
                  className="w-4 h-4 rounded-full block mr-3"
                  style={{ backgroundColor: "#599EFD" }}
                ></span>
                <p>Not Started</p>
              </li>
            ) : (
              ""
            )}
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
            </li>
            <li className="border-b border-gray-300 text-yellow-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-yellow-600 block mr-3"></span>
              <p>Working on it</p>
            </li>
            <li className="border-b border-gray-300 text-red-500 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-red-500 block mr-3"></span>
              <p>Stuck</p>
            </li>
          </ul>
        </td>
        <td>
          <span
            className="block mx-auto rounded-full h-6 w-6/7  bg-blue-600 overflow-hidden relative"
            style={{ zIndex: 0 }}
          >
            <div className="bg-blue-600 w-1/2 h-full z-10 relative"></div>
            <input
              readOnly
              ref="date"
              value={new Date(this.props.date + new Date().getTimezoneOffset()*60*1000).toDateString()}
              className="text-center text-white  text-sm z-20 center bg-transparent"
            />
          </span>
        </td>
        <td className="text-gray-600"> {this.state.time} </td>
      </tr>
    );
  }
}

export default Todo;
