import React, { Component } from "react";
import Confetti from "react-confetti";
//firebase
import { db } from "../../../config/firebase";
import { Link } from "react-router-dom";
class Todo extends Component {
  state = {
    userId: "",
    id: null,
    users: [],
    iTimes: 0,
    time: ``,
    confettiStart: false,
    status: "Not Started",
    endTime: ``,
    name: "",
    activeUser: {}
  };

  // ! update status function
  updateStatus = todosId => {
    let status = this.refs.status.innerText;
    db.collection("todos")
      .doc(todosId)
      .update({ status });
  };

  //! handle submit for deleting todo
  deleteOne = todoId => {
    db.collection("todos")
      .doc(todoId)
      .delete()
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };
  componentWillReceiveProps(props) {
    this.forceUpdate();
    this.refs.status.textContent = props.status;
    var text = this.refs.status.textContent;
    this.setState({
      status: text,
      endTime: props.endTime,
      userId: props.userId || this.state.userId
    });
    if (this.state.status === "Done") {
      this.refs.status1.style.backgroundColor = "#03C977";
      this.refs.dropdown1.classList.add("invisible");
      this.updateTime();
      this.stopTimer();
    } else if (this.state.status === "Stuck") {
      if (this.state.iTimes === 0) this.updateTime();
      this.refs.status1.style.backgroundColor = "#E1445B";
    } else if (this.state.status === "Working on it") {
      this.refs.status1.style.backgroundColor = "#F7AE3C";
      if (this.state.iTimes === 0) this.updateTime();
    } else if (this.state.status === "Not Started") {
      this.refs.dropdown1.classList.remove("invisible");
      this.refs.status1.style.backgroundColor = "#599EFD";
    }
  }
  componentWillUpdate() {
    if (this.state.status === "Done") {
      this.refs.status1.style.backgroundColor = "#03C977";
      this.refs.dropdown1.classList.add("invisible");
    } else if (this.state.status === "Stuck") {
      this.refs.status1.style.backgroundColor = "#E1445B";
    } else if (this.state.status === "Working on it") {
      this.refs.status1.style.backgroundColor = "#F7AE3C";
    } else if (this.state.status === "Not Started") {
      this.refs.dropdown1.classList.remove("invisible");
      this.refs.status1.style.backgroundColor = "#599EFD";
    }
  }
  componentDidMount() {
    //! getting users from fatabase
    db.collection("users")
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          let user = doc.data();
          user.id = doc.id;
          users.push(user);
        });
        this.setState({
          users,
          userId: this.props.userId,
          status: this.props.status
        });
        if (this.state.status === "Done") {
          this.refs.status1.style.backgroundColor = "#03C977";
          this.refs.dropdown1.classList.add("invisible");
          this.updateTime();
          this.stopTimer();
        } else if (this.state.status === "Stuck") {
          if (this.state.iTimes === 0) this.updateTime();
          this.refs.status1.style.backgroundColor = "#E1445B";
        } else if (this.state.status === "Working on it") {
          this.refs.status1.style.backgroundColor = "#F7AE3C";
          if (this.state.iTimes === 0) this.updateTime();
        } else if (this.state.status === "Not Started") {
          this.refs.dropdown1.classList.remove("invisible");
          this.refs.status1.style.backgroundColor = "#599EFD";
        }
        if (this.props.clone)
          this.setState({
            activeUser:
              this.state.users.find(el => el.id === this.props.userId) || {}
          });
        window.addEventListener("click", this.removeDropdown);
        window.addEventListener("click", this.removeDropdown2);
      });
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.removeDropdown);
    window.removeEventListener("click", this.removeDropdown2);
  }
  //! for showing users in dropdown
  showUsers = () => {
    let users = this.state.users;
    return users.map((user, i) => {
      return (
        <li
          key={i}
          onClick={this.onSelect}
          className="border-b border-gray-300 text-green-600 h-12 flex flex-start items-center px-4 cursor-pointer"
          data-userid={user.id}
        >
          <span
            className=" rounded-full bg-cover block"
            style={{
              backgroundImage: `url(${user.url})`,
              width: "30px",
              height: "30px"
            }}
          ></span>
          <p className="ml-3">{user.name}</p>
        </li>
      );
    });
  };

  //! show dropdown for users
  showDropdown = () => {
    this.refs.dropdown.classList.toggle("block");
  };
  removeDropdown = e => {
    if (e.target.id === "dropdown") return false;
    if (this.refs.dropdown) this.refs.dropdown.classList.remove("block");
  };
  removeDropdown2 = e => {
    if (e.target.id === "dropdown1") return false;
    if (this.refs.dropdown1) this.refs.dropdown1.classList.remove("block");
  };
  updateTime = () => {
    let timer;
    if (this.props.timer) {
      if (this.props.stuckTimer) {
        if (this.props.stuckTimer[0] > this.props.timer[0]) {
          timer = this.props.timer[0];
        } else if (this.props.stuckTimer[0] < this.props.timer[0]) {
          timer = this.props.stuckTimer[0];
        }
      } else {
        timer = this.props.timer[0];
      }
    } else if (this.props.stuckTimer) {
      timer = this.props.stuckTimer[0];
    } else {
      timer = new Date().getTime();
    }
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
      if (remainingMins >= 0 && remainingSeconds >= 0) {
        this.setState({
          time: `${hours < 10 ? "0" + hours : hours}:${
            remainingMins < 10 ? "0" + remainingMins : remainingMins
          }:${
            remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
          }`
        });
      } else {
        this.setState({ time: `00:00:00` });
      }

      if (this.props.clone) {
        this.setState({ time: `` });
      }
    }, 1000);
  };
  stopTimer = () => {
    const endTime = this.state.endTime
      ? this.state.endTime
      : new Date().getTime();
    if (!this.props.endTime) {
      db.collection("todos")
        .doc(this.props.url)
        .update({ endTime })
        .then(() => {
          this.setState({ endTime });
        });
    }
  };

  //! status dropdown
  handleDropdown = (id, arrI) => {
    const status_priority_dropdown = document.querySelectorAll(
      `#panel-${arrI} .status_priority_wrapper > .status_priority_dropdown`
    );
    const all_dropdowns = document.querySelectorAll(
      `.status_priority_wrapper > .status_priority_dropdown`
    );
    all_dropdowns.forEach(el => {
      el.style.display = "none";
      el.classList.remove("block");
    });
    status_priority_dropdown[id].classList.toggle("block");
    const status_priority_wrapper = document.querySelector(
      `#panel-${arrI} .status_priority_wrapper${id}`
    );
    for (
      let i = 0;
      i < status_priority_dropdown[id].querySelectorAll("li").length;
      i++
    ) {
      status_priority_dropdown[id]
        .querySelectorAll("li")
        [i].addEventListener("click", e => {
          const text = e.target.innerText;
          this.setState({ status: text });
          if (this.state.status === "Done") {
            this.setState({
              confettiStart: true
            });
            status_priority_wrapper.style.backgroundColor = "#03C977";
            this.refs.status.innerText = "Done";
            status_priority_dropdown[id].classList.add("invisible");
            this.updateTime();
            this.stopTimer();
          } else if (this.state.status === "Stuck") {
            this.refs.status.innerText = "Stuck";
            status_priority_wrapper.style.backgroundColor = "#E1445B";
            this.updateTime();
            let stuckTimer;
            if (this.props.stuckTimer) {
              if (this.props.stuckTimer.length > 0) {
                stuckTimer = [...this.props.stuckTimer, new Date().getTime()];
              } else {
                stuckTimer = [new Date().getTime()];
              }
            } else {
              stuckTimer = [new Date().getTime()];
            }
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                stuckTimer
              })
              .then(() => {
                window.location.reload();
              });
          } else if (this.state.status === "Working on it") {
            this.refs.status.innerText = "Working on it";
            status_priority_wrapper.style.backgroundColor = "#F7AE3C";
            this.updateTime();
            let timer;
            if (this.props.timer) {
              if (this.props.timer.length > 0) {
                timer = [...this.props.timer, new Date().getTime()];
              } else {
                timer = [new Date().getTime()];
              }
            } else {
              timer = [new Date().getTime()];
            }
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                timer
              })
              .then(() => {
                window.location.reload();
              });
          } else if (text === "Not Started") {
            this.refs.status.innerText = "Not Started";
            status_priority_wrapper.style.backgroundColor = "royalblue";
          }
          if (this.props.todoId) {
            this.updateStatus(this.props.todoId);
          }
        });
    }
    this.setState({ id });
  };
  //! user select
  onSelect = e => {
    const userId =
      e.target.dataset.userid ||
      e.target.parentNode.dataset.userid ||
      e.target.parentNode.parentNode.dataset.userid;
    this.setState({ userId });
    const user = this.state.users.find(el => el.id === userId);
    if (this.props.clone) this.setState({ activeUser: user });
    this.refs.images.style.backgroundImage = `url(${user.url})`;
  };
  render() {
    const isRead = this.props.commentReads.find(el => el === false);
    return (
      <tr
        className="bg-white border-b border-gray-100"
        style={{ backgroundColor: "#f5f6f8" }}
      >
        <td
          style={{ backgroundColor: "#f5f6f8" }}
          className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container"
          ref="title"
        >
          {this.props.title}
          {!this.props.clone ? (
            this.props.url ? (
              <Link
                to={`/admin_panel/comments/${this.props.url}`}
                className="relative chat-wrapper cursor-pointer"
              >
                <i
                  style={{
                    color:
                      isRead === false
                        ? this.props.commentsLength > 0
                          ? `#2b6cb0`
                          : `#a0aec0`
                        : `#a0aec0`
                  }}
                  className="text-3xl text-gray-500 chat-icon far fa-comment"
                ></i>
                <div
                  style={{
                    backgroundColor:
                      isRead === false
                        ? this.props.commentsLength > 0
                          ? `#2b6cb0`
                          : `#a0aec0`
                        : `#a0aec0`
                  }}
                  className="w-4 h-4 rounded-full text-xs bg-gray-500 text-white absolute bottom-0 right-0 pointer-events-none commentBox"
                >
                  {this.props.commentsLength}
                </div>
              </Link>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <Confetti
            numberOfPieces={3000}
            recycle={false}
            initialVelocityX={6}
            initialVelocityY={50}
            run={this.state.confettiStart}
          />
        </td>
        <td style={{ position: "relative" }}>
          <div
            ref="images"
            readOnly
            id="dropdown"
            className="h-full bg-cover rounded-full mx-auto"
            style={{
              width: "35px",
              height: `35px`,
              backgroundPosition: `center`,
              backgroundImage: `url(${this.props.userImg})`
            }}
            onClick={this.showDropdown}
          >
            <div className="userId hidden">{this.state.activeUser.id}</div>
          </div>
          <ul
            ref="dropdown"
            className={`absolute top-0 mt-12 shadow-xl -mr-2 left-0 w-48 bg-white dropdown z-50 capitalize hidden status_priority_dropdown rounded-lg dropdown0 ${
              this.props.state === "Add" || this.props.clone ? "" : "invisible"
            }`}
            style={{ width: `17.5rem` }}
          >
            {this.showUsers()}
          </ul>
        </td>
        <td
          ref="status1"
          style={{ backgroundColor: "#599EF1" }}
          className={`text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index, this.props.arrI)}
        >
          <p ref="status" className="status" id="dropdown1">
            {this.props.status}
          </p>
          <ul
            ref="dropdown1"
            className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown"
            style={{ backgroundColor: `#fff` }}
          >
            {this.state.status === "Not Started" ? (
              <li className="select1 border-b border-gray-300 text-green-600 py-2 flex flex-start items-center px-4">
                <span
                  style={{ backgroundColor: "#599EFD" }}
                  className="w-4 h-4 rounded-full block mr-3"
                ></span>
                <p>Not Started</p>
              </li>
            ) : (
              ""
            )}

            {this.state.status === "Working on it" ? (
              ""
            ) : (
              <li className="select1 border-b border-gray-300 text-yellow-600 py-2 flex flex-start items-center px-4">
                <span className="w-4 h-4 rounded-full bg-yellow-600 block mr-3"></span>
                <p>Working on it</p>
              </li>
            )}
            {this.state.status === "Stuck" ? (
              ""
            ) : (
              <li className="select1 border-b border-gray-300 text-red-500 py-2 flex flex-start items-center px-4">
                <span className="w-4 h-4 rounded-full bg-red-500 block mr-3"></span>
                <p>Stuck</p>
              </li>
            )}
            <li className="select1 border-b border-gray-300 text-green-600 py-2 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
            </li>
          </ul>
        </td>
        <td>
          <span
            style={{ backgroundColor: this.props.stuckTimer ? "#E1445B" : "" }}
            className="block mx-auto rounded-full h-5 w-6/7  bg-blue-600 overflow-hidden relative timeline"
          >
            <div
              style={{
                backgroundColor: this.props.stuckTimer ? "#E1445B" : ""
              }}
              className="bg-blue-600 w-1/2 h-full z-10 relative"
            ></div>
            <input
              type="date"
              ref="date"
              readOnly={this.props.clone ? false : !!this.props.url}
              defaultValue={this.props.date}
              className={`text-center text-white text-sm z-20 center bg-transparent calenderShow ${
                this.props.clone ? "cloneDate" : ""
              }`}
              required
              onChange={e =>
                this.props.clone ? this.props.cloneDate(e.target.value) : ""
              }
            />
          </span>
        </td>
        <td className="text-gray-600 timer" ref="timer">
          {" "}
          {this.state.time}{" "}
        </td>
        <td>
          {!this.props.clone ? (
            <button
              onClick={e => this.deleteOne(this.props.todoId)}
              className="rounded px-4 py-2 text-center bg-red-800 text-white cursor-pointer ml-3 outline-none"
            >
              {this.props.state}
            </button>
          ) : (
            ""
          )}
        </td>
      </tr>
    );
  }
}

export default Todo;
