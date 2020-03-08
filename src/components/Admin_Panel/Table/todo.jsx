import React, { Component } from "react";
import Confetti from "react-confetti";
//firebase
import { db } from "../../../config/firebase";
import img from "../../../images/no_image.jpg";
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
    name:""
  };

  // ! update status function
  updateStatus = todosId => {
    let status = this.refs.status.innerText;
    db.collection("todos")
      .doc(todosId)
      .update({
        status
      })
      .then(() => {
        console.log("Document successfully updated!");
      });
  };

  //! handle submit for adding todo
  add = () => {
    let picker = document.querySelector(".valuePicker");
    const title = picker.selectedOptions[0].innerText;
    let status = this.refs.status.innerText;
    let date = this.refs.date.value
      ? new Date(this.refs.date.value).toLocaleDateString()
      : "";
    const userId = this.state.userId;
    if (date === "") {
      this.refs.date.style.color = "red";
    } else if (picker.selectedIndex === 0) {
      picker.style.color = "red";
      picker.selectedOptions[0].innerText = "Please Select a Task";
    } else if(this.state.userId === ""){
      return ;
    } else {
      db.collection("todos")
        .add({title,userId,status,date})
        .then(docRef => {
          this.setState({
            todoId: 1
          });
          console.log("Document written with ID: ", docRef.id);
          window.location.reload();
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  };

  //! handle submit for deleting todo
  deleteOne = todoId => {
    db.collection("todos")
      .doc(todoId)
      .delete()
      .then(() => {
        console.log("deleted");
        window.location.reload();
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };
  componentWillReceiveProps() {
    var text = this.refs.status.textContent;
    this.setState({ status: text });
    this.setState({ endTime: this.props.endTime });
    if (this.state.status === "Done") {
      this.refs.status1.style.backgroundColor = "#03C977";
      this.refs.dropdown1.classList.add("invisible");
      this.updateTime();
      this.stopTimer();
    } else if (this.state.status === "Stuck") {
      if (this.state.iTimes === 0) this.updateTime();
      this.refs.status1.style.backgroundColor = "#E1445B";
    } else if (this.state.status === "Working on It") {
      this.refs.status1.style.backgroundColor = "#F7AE3C";
      if (this.state.iTimes === 0) this.updateTime();
    } else if (this.state.status === "Not Started") {
      this.refs.status1.style.backgroundColor = "#599EFD";
    }
  }
  componentWillUpdate(){
    if (this.state.status === "Done") {
      this.refs.status1.style.backgroundColor = "#03C977";
      this.refs.dropdown1.classList.add("invisible");
    } else if (this.state.status === "Stuck") {
      this.refs.status1.style.backgroundColor = "#E1445B";
    } else if (this.state.status === "Working on It") {
      this.refs.status1.style.backgroundColor = "#F7AE3C";
    } else if (this.state.status === "Not Started") {
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
          userId: this.props.userId
        });
        window.addEventListener("click", this.removeDropdown);
        window.addEventListener("click", this.removeDropdown2);
        const user =
          this.state.users.find(el => el.id === this.state.userId) || {};
        this.refs.images.style.backgroundImage = `url(${user.url || img})`;
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
    this.refs.dropdown.classList.remove("block");
  };
  removeDropdown2 = e => {
    if (e.target.id === "dropdown1") return false;
    this.refs.dropdown1.classList.remove("block");
  };
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
        .then(() => this.setState({ endTime }));
    }
  };
  //! status dropdown
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
          const text = e.target.innerText;
          this.setState({ status: text });
          console.log(this.state.status);
          if (this.state.status === "Done") {
            this.setState({
              confettiStart: true
            });
            status_priority_wrapper.style.backgroundColor = "#03C977";
            status_priority_wrapper.children[0].innerText = "Done";
            status_priority_dropdown[id].classList.add("invisible");
            this.updateTime();
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
              .update({timer})
              .then(() => {
                window.location.reload();
                console.log("Document successfully updated!");
              });
          } else if (this.state.status === "Working on it") {
            status_priority_wrapper.children[0].innerText = "Working on It";
            status_priority_wrapper.style.backgroundColor = "#F7AE3C";

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
                window.location.reload();
                console.log("Document successfully updated!");
              });
          } else if (text === "Not Started") {
            status_priority_wrapper.children[0].innerText = "Not Started";
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
    const userId = e.target.dataset.userid
      ? e.target.dataset.userid
      : e.target.parentNode.dataset.userid;
    this.setState({ userId });
    const user = this.state.users.find(el => el.id === userId);
    this.refs.images.style.backgroundImage = `url(${user.url})`;
  };
  render() {
    return (
      <tr className="bg-gray-100 border-b border-gray-100">
        <td className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container">
          {this.props.title}
          <Link
            to={`/admin_panel/comments/${this.props.url}`}
            className="relative chat-wrapper cursor-pointer"
          >
            <i
              style={{
                color: this.props.commentsLength > 0 ? `#2b6cb0` : `#a0aec0`
              }}
              className="text-3xl text-gray-500 chat-icon far fa-comment"
            ></i>
            <div
              style={{
                backgroundColor:
                  this.props.commentsLength > 0 ? `#2b6cb0` : `#a0aec0`
              }}
              className="w-4 h-4 rounded-full text-xs bg-gray-500 text-white absolute bottom-0 right-0 pointer-events-none"
            >
              {this.props.commentsLength}
            </div>
          </Link>
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
            id="dropdown"
            className="h-full bg-cover rounded-full mx-auto"
            style={{
              width: "40px",
              backgroundPosition: `center`
            }}
            onClick={this.showDropdown}
          ></div>
          <ul
            ref="dropdown"
            className="absolute top-0 mt-12 shadow-xl -mr-2 left-0 w-48 bg-white dropdown z-50 capitalize hidden status_priority_dropdown rounded-lg dropdown0"
            style={{ width: `17.5rem` }}
          >
            {this.showUsers()}
          </ul>
        </td>
        <td
          ref="status1"
          style={{ backgroundColor: "#599EF1" }}
          className={`text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index)}
        >
          <p ref="status" id="dropdown1">
            {this.props.status}
          </p>
          <ul
            ref="dropdown1"
            className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown"
            style={{ backgroundColor: `#fff` }}
          >
            {this.state.status === "Not Started" ? (
              <li className="select1 border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
                <span
                  style={{ backgroundColor: "#599EFD" }}
                  className="w-4 h-4 rounded-full block mr-3"
                ></span>
                <p>Not Started</p>
              </li>
            ) : (
              ""
            )}
            <li className="select1 border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
            </li>
            <li className="select1 border-b border-gray-300 text-yellow-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-yellow-600 block mr-3"></span>
              <p>Working on it</p>
            </li>
            <li className="select1 border-b border-gray-300 text-red-500 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-red-500 block mr-3"></span>
              <p>Stuck</p>
            </li>
          </ul>
        </td>
        <td>
          <span className="block mx-auto rounded-full h-6 w-6/7  bg-black overflow-hidden relative">
            <div className="bg-purple-600 w-1/2 h-full z-10 relative"></div>
            <input
              type="date"
              ref="date"
              defaultValue={this.props.date}
              className="text-center text-white  text-sm z-20 center bg-transparent calenderShow"
              required
            />
          </span>
        </td>
        <td className="text-gray-600"> {this.state.time} </td>
        <td>
          <button
            onClick={e => {
              if (e.target.innerText === "Add") {
                this.add();
              } else if (e.target.innerText === "Delete") {
                this.deleteOne(this.props.todoId);
              }
            }}
            className="rounded px-4 py-2 text-center bg-red-800 text-white cursor-pointer ml-3 outline-none"
          >
            {this.props.state}
          </button>
        </td>
      </tr>
    );
  }
}

export default Todo;
