import React, { Component } from "react";
import { db } from "../../config/firebase";

class Todo extends Component {
  state = {
    id: null,
    date: [new Date(), new Date()],
    users: []
  };

  //getting users from fatabase
  componentDidMount = () => {
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        users.push(user);
      });

      this.setState({ users });
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
              backgroundImage: `url(${user.url})`,
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

  //calender
  onChange = date => this.setState({ date });

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
        [i].addEventListener("click", function() {
          var text = this.innerText;
          if (text === "Done") {
            status_priority_wrapper.style.backgroundColor = "#48bb77";
            status_priority_wrapper.children[0].innerText = "Done";
          } else if (text === "Stuck") {
            status_priority_wrapper.style.backgroundColor = "#f56464";
            status_priority_wrapper.children[0].innerText = "Stuck";
          } else if (text === "Working on it") {
            status_priority_wrapper.children[0].innerText = "it is working";
            status_priority_wrapper.style.backgroundColor = "#d69e2e";
          }
        });
    }
    this.setState({ id });
  };

  //user select
  onSelect = e => {
    const num =
      e.target.dataset.num !== undefined
        ? e.target.dataset.num
        : e.target.parentNode.dataset.num;
    console.log(this.refs);
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
              backgroundImage: `url(${this.props.personImg})`,
              width: "40px"
            }}
            onClick={this.showDropdown}
          ></div>
          <div className="dropdown1" ref="dropdown">
            {this.showUsers()}
          </div>
        </td>
        <td
          className={`bg-green-500 text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index)}
        >
          <p>Done</p>
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
              <p>Stack</p>
            </li>
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
            </li>
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p></p>
            </li>
            <li className="border-b border-gray-300 text-yellow-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-yellow-600 block mr-3"></span>
              <p></p>
            </li>
            <li className="border-b border-gray-300 text-red-500 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-red-500 block mr-3"></span>
              <p></p>
            </li>
          </ul>
        </td>
        <td>
          <span className="block mx-auto rounded-full h-6 w-6/7 bg-black overflow-hidden relative">
            <div className="bg-purple-600 w-1/2 h-full z-10 relative"></div>
            <input
              readOnly
              type="date"
              className="text-center text-white  text-sm z-20 center bg-transparent"
            />
          </span>
        </td>
        <td className="text-gray-600">{this.props.tracking}</td>
      </tr>
    );
  }
}

export default Todo;
