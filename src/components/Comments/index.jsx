import React, { Component } from "react";
import { db } from "../../config/firebase";
import img from "../../images/no_image.jpg";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { AuthContext } from "../../context/AuthContext"
class Comments extends Component {
  static contextType = AuthContext;
  state = {
    comments: [],
    commentIndex: null,
    users: [],
    content: "",
    userId: "",
    todoId: "",
    todo: {},
    name: "",
    sortedTimes: [],
    caretPosition: 0
  };
  removeDropDown = e => {
    if (
      e.target.classList.contains("dropdown2") &&
      !e.target.classList.contains("status_priority_dropdown")
    )
      return;
    this.refs.dropdown.classList.remove("block");
  };
  handleDropdown = () => {
    this.refs.dropdown.classList.toggle("block");
  };
  selectOption = e => {
    const id = e.target.dataset.id || e.target.parentNode.dataset.id;
    const user = this.state.users.find(el => el.id === id);
    this.setState({ userId: user.id });
    this.setState({ todoId: this.props.match.params.commentId });
    this.refs.image.style.backgroundImage = `url(${user.url})`;
    this.refs.name.innerHTML = user.name;
    this.setState({ name: user.name });
  };
  handleUpdate = e => {
    e.preventDefault();
    if (this.state.name === "") {
      this.refs.name.innerHTML = "Please Select a User";
      this.refs.name.style.color = "red";
      return false;
    } else {
      db.collection("comments")
        .add({
          content: this.state.content,
          userId: this.state.userId,
          todoId: this.state.todoId,
          date: new Date().getTime(),
          read: false
        })
        .then(docRef => {
          this.setState({ content: "" });
          this.refs.popup.style.right = "-100%";
          setTimeout(() => {
            this.props.history.goBack();
          }, 800);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  };

  statusLog = () => {
    let workingOnIt = this.state.todo.timer || [];
    let stuckTimer = this.state.todo.stuckTimer || [];
    // let endTime = this.state.todo.endTime;
    const working = workingOnIt.map((el, i) => {
      return {
        date: el,
        title: `Working on it`,
        read: true
      };
    });
    const stuck = stuckTimer.map((el, i) => {
      return {
        date: el,
        title: `Stuck`,
        read: true
      };
    });
    // const done = {
    //   date: endTime,
    //   title: `Done`,
    //   read: true
    // };
    const all = [...working, ...stuck];
    all.sort((a, b) => {
      return a.date - b.date;
    });
    let times = all.filter((el, i) => {
      return el.date;
    });
    times = times.map((el, i) => {
      if (!times[i - 1]) {
        return null;
      } else {
        return {
          content: (
            <p>
              Status was updated from <b>{times[i - 1].title}</b> to{" "}
              <b>{el.title}</b>.
            </p>
          ),
          date: el.date,
          read: true,
          statusLog: true
        };
      }
    });
    const sortedTimes = times.filter(el=> el);
    this.setState({ sortedTimes });
  };

  Read = commentId => {
    let read = true;
    db.collection("comments")
      .doc(commentId)
      .update({
        read
      });
  };
  unRead = commentId => {
    let read = false;
    db.collection("comments")
      .doc(commentId)
      .update({ read });
  };

  componentWillUnmount = () => {
    window.removeEventListener("click", this.removeDropDown);
    window.removeEventListener("click", this.handleDropdown2);
  };
  handleDropdown2 = e => {
    if (e.target.id === "icon") return;
    if (document.querySelector(".emoji-mart")) {
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
      document.querySelector(".emoji-mart").classList.remove("block");
    }
  };
  componentDidMount() {
    window.addEventListener("click", this.removeDropDown);
    window.addEventListener("click", this.handleDropdown2);
    //! for rendering user from database
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      this.setState({
        users,
        userId: users[0].id,
        todoId: this.props.match.params.commentId
      });
      db.collection(this.props.match.params.board).onSnapshot(querySnapshot => {
        let todos = [];
        querySnapshot.forEach(doc => {
          let todo = doc.data();
          todo.id = doc.id;
          todos.push(todo);
        });
        const todo = todos.find(
          el => el.id === this.props.match.params.commentId
        );
        const userTodo = this.state.users.find(el => el.id === todo.userId);
        todo.url = userTodo.url || img;
        this.setState({ todo });
        this.statusLog1();
        this.statusLog();
      });
    });
    //! for rendering comments from database
    db.collection("comments").onSnapshot(querySnapshot => {
      let comments = [];
      querySnapshot.forEach(doc => {
        let comment = doc.data();
        comment.id = doc.id;
        comments.push(comment);
      });
      comments = comments.filter(
        el => el.todoId === this.props.match.params.commentId
      );
      this.setState({ comments });
      if (this.refs.popup) {
        this.refs.popup.style.right = "0";
      }
    });
  }
  showUsers = () => {
    return this.state.users.map((el, i) => (
      <li
        key={i}
        onClick={this.selectOption}
        className="border-b border-gray-300 text-green-600 h-12 flex flex-start items-center px-4 cursor-pointer"
        data-id={el.id}
      >
        <span
          className=" rounded-full bg-cover block"
          style={{
            backgroundImage: `url(${el.url})`,
            width: "30px",
            height: "30px"
          }}
        ></span>
        <p className="ml-3">{el.name}</p>
      </li>
    ));
  };
  // !status log
  statusLog1 = () => {
    let workingOnIt = this.state.todo.timer ? this.state.todo.timer[0] : null;
    let endTime = this.state.todo.endTime;
    let stuckTimer = this.state.todo.stuckTimer
      ? this.state.todo.stuckTimer[0]
      : null;
    let timeOfDone = new Date(endTime).toLocaleTimeString();
    let timeOfworking = new Date(workingOnIt).toLocaleTimeString();
    let timeOfstuck = new Date(stuckTimer).toLocaleTimeString();
    if (this.refs.statusLog1) {
      if (workingOnIt && endTime && stuckTimer) {
        this.refs.statusLog1.innerHTML = `<b>Working on it:</b> ${timeOfworking} | <b>Stuck:</b> ${timeOfstuck} | <b>Done:</b> ${timeOfDone}`;
      } else if (endTime && stuckTimer) {
        this.refs.statusLog1.innerHTML = `<b>Stuck:</b> ${timeOfstuck} | <b>Done:</b> ${timeOfDone}`;
      } else if (workingOnIt && endTime) {
        this.refs.statusLog1.innerHTML = `<b>Working on it:</b> ${timeOfworking} | <b>Done:</b> ${timeOfDone}`;
      } else if (workingOnIt && stuckTimer) {
        this.refs.statusLog1.innerHTML = `<b>Working on it:</b> ${timeOfworking} | <b>Stuck:</b> ${timeOfstuck}`;
      } else if (endTime) {
        this.refs.statusLog1.innerHTML += `<b>Done:</b> ${timeOfDone}`;
      } else if (stuckTimer) {
        this.refs.statusLog1.innerHTML += `<b>Stuck:</b> ${timeOfstuck}`;
      } else if (workingOnIt) {
        this.refs.statusLog1.innerHTML += `<b>Working on it:</b> : ${timeOfworking}`;
      }
    }
  };

  //! showComments

  showComments = () => {
    const comments = [...this.state.comments, ...this.state.sortedTimes];
    comments.sort((a, b) => b.date - a.date);

    return comments.map((comment, i) => {
      const user = this.state.users.find(el => el.id === comment.userId) || {};
      if (user) {
        return (
          <article
            ref="comment1"
            className="p-1 pl-2  border     bg-blue-200"
            key={i}
            style={{ backgroundColor: comment.read ? "white" : "#ADD8E6" }}
          >
            <div className="text-base pt-1 pl-3">
              {comment.content}
              {comment.statusLog ? (
                ""
              ) : !comment.read ? (
                <i
                  title="Click here to mark comment read"
                  onClick={() => this.Read(comment.id)}
                  style={{ float: "right" }}
                  className=" text-2xl text-black-500 fas fa-envelope "
                ></i>
              ) : (
                <i
                  title="Click here to mark comment unread"
                  onClick={() => this.unRead(comment.id)}
                  style={{ float: "right" }}
                  className="text-2xl text-white  fas fa-envelope-open "
                ></i>
              )}
              <p
                className="ml-1 flex  text-gray-500 hover:text-purple-600"
                style={{ color: "grey", fontSize: "12px" }}
              >
                Posted By&nbsp;<b> {user.name || "System User"}</b>&nbsp;on{" "}
                {new Date(comment.date).toLocaleTimeString()}{" "}
                {new Date(comment.date).toDateString()}
              </p>
            </div>
            <span></span>
          </article>
        );
      } else {
        return (
          <article
            className="mt-10 p-6 border border-gary-600 rounded-lg"
            key={i}
          ></article>
        );
      }
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div
        className="fixed w-screen h-screen fixed top-0 left-0 z-50 bg-popup overflow-y-auto"
        style={{ overflowX: `hidden` }}
      >
        <div
          ref="popup"
          className="center bg-white p-8 container rounded-lg center"
          style={{
            transform: `translate(0%,0%)`,
            right: `-100%`,
            top: 0,
            width: `50%`,
            height: `max-content`,
            transition: `all 0.6s ease-in-out`,
            left: `auto`
          }}
        >
          <div className="myDiv">
            <div className="personImg">
              <img
                style={{ height: `40px`, width: `40px` }}
                src={this.state.todo.url}
                alt={this.state.name}
              />
            </div>
            <div className="personTask">{this.state.todo.title}</div>
            <div
              ref="statusLog1"
              style={{
                position: `absolute`,
                width: `450px`,
                right: `30px`,
                bottom: `-35px`,
                textAlign: `center`,
                fontSize: "12px"
              }}
            ></div>
          </div>
          <div className="flex justify-start mb-4">
            <i
              onClick={() => {
                this.refs.popup.style.right = "-100%";
                setTimeout(() => {
                  this.props.history.goBack();
                }, 800);
              }}
              className="fa fa-times text-lg cursor-pointer text-gray-700"
              aria-hidden="true"
              style={{ fontSize: "1.5em", zIndex: 100 }}
            ></i>
          </div>
          <div className="mt-10 update-section" id="Update_section">
            <div
              onClick={this.handleDropdown}
              className="flex text-gray-500x my-4 dropdown2"
            >
              <div
                ref="image"
                className="h-full bg-cover rounded-full  bg-gray-300 relative pic-wrapper dropdown2"
                style={{
                  backgroundImage: `url(${img})`,
                  width: "40px",
                  height: "40px"
                }}
              ></div>
              <ul
                ref="dropdown"
                className="absolute top-0 mt-12 shadow-xl random -mr-2 left-0 w-48 bg-white dropdown z-50 capitalize hidden status_priority_dropdown rounded-lg"
                style={{ width: `17.5rem`, marginTop: `190px` }}
              >
                {this.showUsers()}
              </ul>
              <p className="ml-2 flex self-center dropdown2" ref="name">
                Select User
              </p>
            </div>
            <form action="/" onSubmit={this.handleUpdate}>
              <div className="relative">
                <textarea
                  onChange={this.handleChange}
                  name="content"
                  className="w-full py-3 px-6 border border-gary-600 rounded-lg text-sm text-black outline-none focus:border-purple-600 overflow-hidden"
                  placeholder="Write an Update..."
                  required
                  value={this.state.content}
                  onKeyDown={(e)=>{
                    this.setState({caretPosition: e.target.selectionEnd})
                  }}
                  onKeyUp={(e)=>{
                    this.setState({caretPosition: e.target.selectionEnd})
                  }}
                  onBlur={(e)=>{this.setState({caretPosition: e.target.selectionEnd})}}
                ></textarea>
                <i
                  className="far fa-smile"
                  id="icon"
                  onClick={e => {
                    if(this.context.isAuthenticated){
                      document
                      .querySelectorAll("section.emoji-mart")[1]
                      .classList.toggle("block");
                    }else{
                      document
                      .querySelectorAll("section.emoji-mart")[0]
                      .classList.toggle("block");
                    }
                  }}
                  style={{ position: `absolute`, bottom: `15%`, right: `5%` }}
                ></i>
                <Picker
                  title=""
                  emoji=""
                  onSelect={e => {
                    const content = this.state.content.slice(0,this.state.caretPosition) + e.native + this.state.content.slice(this.state.caretPosition)
                    this.setState({ content });
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button className="rounded px-8  py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none">
                  Add Comment
                </button>
              </div>
            </form>
          </div>
          {this.showComments()}
        </div>
      </div>
    );
  }
}
export default Comments;
