import React, { Component } from "react";

//firebase
import { db } from "../../config/firebase";
let time = ``
class Todo extends Component {
  state = {
    selectUserIndex: 0,
    id: null,
    users: [],
    
  };

  // ! update status function
  updateStatus = todosId => {
    let status = this.refs.status.innerText;
    console.log(status);
    db.collection("todos")
      .doc(todosId)
      .update({
        status
      })
      .then(function() {
        console.log("Document successfully updated!");
      });
  };

  //! handle submit for adding todo
  add = () => {
    let title = document.querySelector(".valuePicker").value;
    let selectUserIndex = this.state.selectUserIndex;
    let status = this.refs.status.innerText;
    let dateArray = this.refs.date.value.split("-");
    let date = [dateArray[1], dateArray[2], dateArray[0]].join("-");

    if (title === "" || date === "") {
      alert("feilds are required");
    } else {
      db.collection("todos")
        .add({
          title: title,
          selectUserIndex: selectUserIndex,
          status: status,
          date: date
        })
        .then(docRef => {
          this.setState({
            todoId: 1
          });
          console.log("Document written with ID: ", docRef.id);
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
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };
  componentWillUpdate() {
    var text = this.refs.status.textContent;
    if (text === "Done") {
      this.refs.status_wrapper.style.backgroundColor = "#48bb77";
    } else if (text === "Stuck") {
      this.refs.status_wrapper.children[0].innerText = "Stuck";
    } else if (text === "Working on It") {
      this.refs.status_wrapper.style.backgroundColor = "#d69e2e";
      this.updateTime()
    } else if (text === "Not Started") {
      this.refs.status_wrapper.style.backgroundColor = "royalblue";
    }
  }
  //! getting users from fatabase
  componentDidMount = () => {
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        users.push(user);
      });
      this.setState({
        users,
        selectUserIndex: this.props.selectUserIndex
      });
      this.refs.images.style.backgroundImage = `url(${
        this.state.users[this.props.selectUserIndex].url
      })`;
    });
  };

  //for showing users in dropdown
  showUsers = () => {
    let users = this.state.users;
    return users.map((user, i) => {
      return (
        <div key={i} className="user" data-num={i}>
          <div
            className="h-full bg-cover rounded-full mx-auto"
            ref={`dropdown-img-${i}`}
            onClick={this.onSelect}
            style={{
              backgroundImage: `url(${users[i].url})`,
              width: "40px",
              height: `40px`,
              display: `inline-block`
            }}
          ></div>
          <span className="userName" onClick={this.onSelect}>
            {user.name}
          </span>
        </div>
      );
    });
  };

  //show dropdown for users
  showDropdown = () => {
    this.refs.dropdown.classList.toggle("block");
  };
  updateTime = () => {
    const timer = this.props.timer ? this.props.timer : new Date().getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = now - timer;
      const seconds = Math.floor(remainingTime / 1000);
      const mins = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
        time= `${hours < 10 ? "0" + hours : hours}:${
          remainingMins < 10 ? "0" + remainingMins : remainingMins
        }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`
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
    if (status_priority_dropdown[id].style.display === "block") {
      status_priority_dropdown[id].style.display = "none";
    } else {
      status_priority_dropdown[id].style.display = "block";
    }
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
          if (text === "Done") {
            status_priority_wrapper.style.backgroundColor = "#48bb77";
            status_priority_wrapper.children[0].innerText = "Done";
          } else if (text === "Stuck") {
            status_priority_wrapper.style.backgroundColor = "#f56464";
            status_priority_wrapper.children[0].innerText = "Stuck";
          } else if (text === "Working on it") {
            status_priority_wrapper.children[0].innerText = "Working on It";
            status_priority_wrapper.style.backgroundColor = "#d69e2e";
            this.updateTime();
            const timer = this.props.timer
              ? this.props.timer
              : new Date().getTime();
            console.log(this.props.todoId);
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                timer
              })
              .then(() => {
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

  //user select
  onSelect = e => {
    const num = e.target.dataset.num
      ? e.target.dataset.num
      : e.target.parentNode.dataset.num;
    this.setState({
      selectUserIndex: num
    });
    this.refs.images.style.backgroundImage = this.refs[
      `dropdown-img-${num}`
    ].style.backgroundImage;
  };
  render() {
    return (
      <tr className="bg-gray-100 border-b border-gray-100">
        <td className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container">
          {this.props.title}
          <div className="relative chat-wrapper cursor-pointer">
            <i className="text-3xl text-gray-500 chat-icon far fa-comment"></i>
            <div className="w-4 h-4 rounded-full text-xs bg-gray-500 text-white absolute bottom-0 right-0 pointer-events-none">
              {this.props.commentsLength}
            </div>
          </div>
        </td>
        <td style={{ position: "relative" }}>
          <div
            ref="images"
            className="h-full bg-cover rounded-full mx-auto "
            style={{
              width: "40px"
            }}
            onClick={this.showDropdown}
          ></div>
          <div className="dropdown1" ref="dropdown">
            {this.showUsers()}
          </div>
        </td>
        <td
          ref="status_wrapper"
          className={`bg-green-500 text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index)}
        >
          <p
            ref="status"
            onChange={() => {
              this.updateStatus(this.props.todoId);
            }}
          >
            {this.props.status}
          </p>
          <ul className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown">
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span
                className="w-4 h-4 rounded-full block mr-3"
                style={{ backgroundColor: `royalblue` }}
              ></span>
              <p>Not Started</p>
            </li>
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
          <ul className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown">
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
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
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
              className="text-center text-white  text-sm z-20 center bg-transparent"
              required
            />
          </span>
        </td>
        <td className="text-gray-600"> {time} </td>
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
