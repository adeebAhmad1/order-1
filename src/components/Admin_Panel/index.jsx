import React, { Component } from "react";

import { Link } from "react-router-dom";
//components
import Todo from "./Table/todo";
import Goal from "../utils/goals";
//firebase
import { db } from "../../config/firebase";
import Img from "../../images/no_image.jpg";
//context
import { AuthContext } from "../../context/AuthContext";
import Collapsible from "../utils/Collapsible";
import SideNav from "../utils/SideNav";

class Index extends Component {
  _isMounted = false
  static contextType = AuthContext;
  state = {
    todos: [],
    todoIds: [],
    tasks: [],
    comments: [],
    users: [],
    clone: false,
    clonedDate: null,
    group: {},
    isOpened: false,
    add: false,
    activeUser: {},
    board: "",
    isLoading: true,
    boardLoading: true
  };
  
  //! for showing users in dropdown
  showUsers = () => {
    return this.state.users.map((user, i) => {
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
  //! user select
  onSelect = e => {
    const userId =
      e.target.dataset.userid ||
      e.target.parentNode.dataset.userid ||
      e.target.parentNode.parentNode.dataset.userid;
    this.setState({ userId });
    const user = this.state.users.find(el => el.id === userId);
    this.setState({ activeUser: user });
    this.refs.images.style.backgroundImage = `url(${user.url})`;
  };
  getTodos = (board) => {
    this.setState({ isLoading: true})
    db.collection(
      board || (this.props.match.params
        ? this.props.match.params.board || "todos"
        : "todos")
    )
      .get()
      .then(querySnapshot => {
        let todos = [];
        querySnapshot.forEach(doc => {
          let todo = doc.data();
          todo.id = doc.id;
          todos.push(todo);
        });
        //! for sorting
        todos.sort((a, b) => a.title.localeCompare(b.title));
        todos.sort((a, b) => b.date - a.date);
        this.setState({ todos, todoIds: todos.map(el => el.id) , isLoading: false,boardLoading: false });
        var group = {};
        this.state.todos.forEach(el => {
          const date = new Date(
            el.date + new Date().getTimezoneOffset() * 60 * 1000
          ).toDateString();
          if (date in group) {
            group[date].push(el);
          } else {
            group[date] = new Array(el);
          }
        });
        this.setState({ group});
      });
  };
  componentDidMount = () => {
    this._isMounted = true
    //! for getting all todos
    this.setState({
      board: this.props.match.params
        ? this.props.match.params.board || "todos"
        : "todos"
    });
    this.getTodos();
    //! getting tasks from fatabase
    db.collection("tasks").onSnapshot(querySnapshot => {
      let tasks = [];
      querySnapshot.forEach(doc => {
        let task = doc.data();
        tasks.push(task);
      });
      this.setState({ tasks });
    });
    //! for rendering comments from database
    db.collection("comments").onSnapshot(querySnapshot => {
      let comments = [];
      querySnapshot.forEach(doc => {
        let comment = doc.data();
        comment.id = doc.id;
        comments.push(comment);
      });
      comments = comments.filter(el => {
        return el.todoId;
      });
      this.setState({
        comments
      });
    });
    //! for rendering comments from database
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      this.setState({ users });
      window.addEventListener("click", this.removeDropdown);
    });
  };

  //!dropdown for tasksvalues
  showTasksValues = () => {
    //! for sorting
    let sortedTasksValues = this.state.tasks.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    return sortedTasksValues.map((task, i) => (
      <option value={task.title} key={i}>
        {task.title}
      </option>
    ));
  };
  deleteTodo=()=>{
    this.getTodos()
  }
  //? For Cloning the Existing Todos
  cloneAll = () => {
    //* Clone All Todo
    const datedTodos = Object.values(this.state.group);
    const clonedTodos = datedTodos[0].map(el => {
      el.status = "Not Started";
      el.timer = 0;
      el.endTime = 1;
      el.userId = "";
      el.date = null;
      el.state = "";
      el.clone = true;
      el.stuckTimer = null;
      return el;
    });
    document
      .querySelector("#panel-0")
      .querySelectorAll(`input[type="date"]`)
      .forEach(el => {
        el.value = "";
        el.addEventListener("change", () => {
          document
            .querySelector("#panel-0")
            .querySelectorAll(`input[type="date"]`)
            .forEach(el2 => {
              el2.value = el.value;
            });
        });
      });
    document
      .querySelector("#panel-0")
      .querySelectorAll("td .userId")
      .forEach(el => (el.innerHTML = ""));
    this.setState({ clone: true });
    const todos = [...clonedTodos];
    this.setState({ todos });
  };
  cloneDate = clonedDate => this.setState({ clonedDate });
  //! for new todo
  handleClick = () => {
    this.setState({
      add: true
    });
  };
  showNewTodo = () => {
    const newTodo = {
      title: (
        <select className="valuePicker" defaultValue="select">
          <option disabled value="select">
            Select Task
          </option>
          {this.showTasksValues()}
        </select>
      ),
      state: "Add",
      status: "Not Started",
      timer: "",
      stuckTimer: ""
    };
    return (
      <table className="w-full">
        <thead>
          <tr>
            <th width="50%" className="text-purple-600 text-xl text-left">
              Tasks
            </th>
            <th>Team</th>
            <th width="15%">Status</th>
            <th width="20%">Timeline</th>
            <th width="15%">Time Tracking</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody ref="tbody">
          <tr
            className="bg-white border-b border-gray-100"
            style={{ backgroundColor: "#f5f6f8" }}
          >
            <td
              style={{ backgroundColor: "#f5f6f8" }}
              className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container"
              ref="title"
            >
              {newTodo.title}
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
                  backgroundImage: `url(${Img})`
                }}
                onClick={this.showDropdown}
              >
                <div className="userId hidden">{this.state.activeUser.id}</div>
              </div>
              <ul
                ref="dropdown"
                className={`absolute top-0 mt-12 shadow-xl -mr-2 left-0 w-48 bg-white dropdown z-50 capitalize hidden status_priority_dropdown rounded-lg dropdown0`}
                style={{ width: `17.5rem` }}
              >
                {this.showUsers()}
              </ul>
            </td>
            <td
              ref="status1"
              style={{ backgroundColor: "#599EF1" }}
              className={`text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
            >
              <p ref="status" className="status" id="dropdown1">
                {newTodo.status}
              </p>
            </td>
            <td>
              <span className="block mx-auto rounded-full h-5 w-6/7  bg-blue-600 overflow-hidden relative">
                <div className="bg-blue-600 w-1/2 h-full z-10 relative"></div>
                <input
                  type="date"
                  ref="date"
                  className={`text-center text-white text-sm z-20 center bg-transparent calenderShow`}
                  required
                />
              </span>
            </td>
            <td className="text-gray-600 timer" ref="timer"></td>
            <td>
              <button
                onClick={this.add}
                className="rounded px-4 py-2 text-center bg-red-800 text-white cursor-pointer ml-3 outline-none"
              >
                {newTodo.state}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };
  showTables = () => {
    const dates = Object.keys(this.state.group);
    const todos = Object.values(this.state.group);
    return dates.map((el, i) => {
      const length = todos[i].length;
      return (
        <Collapsible
          length={length}
          key={i}
          content={
            <table className="w-full">
              <thead>
                <tr>
                  <th width="50%" className="text-purple-600 text-xl text-left">
                    Tasks
                  </th>
                  <th>Team</th>
                  <th width="15%">Status</th>
                  <th width="20%">Timeline</th>
                  <th width="15%">Time Tracking</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody ref="tbody">{this.showTodos(todos[i], i)}</tbody>
            </table>
          }
          i={i}
          active={todos[i][0].state === "Add" ? true : false}
          date={el}
        />
      );
    });
  };
  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener("click", this.removeDropdown);
  }
  UNSAFE_componentWillReceiveProps (props) {
    if (props.match.params.board !== this.state.board) {
      this.setState({isLoading: true,boardLoading: true})
      this.getTodos(props.match.params.board)
      this.setState({ board: props.match.params.board });
    }
  }
  //! for rendering all todos
  showTodos = (todos, arrI) => {
    if(todos.length > 0){
      if(this._isMounted){
        return todos.map((el, i) => {
          let date;
          if (el.date) {
            let dateArray = new Date(
              el.date + new Date().getTimezoneOffset() * 60 * 1000
            )
              .toLocaleDateString()
              .split("/");
            date = [
              dateArray[2],
              dateArray[0] >= 10 ? dateArray[0] : "0" + dateArray[0],
              dateArray[1] >= 10 ? dateArray[1] : "0" + dateArray[1]
            ].join("-");
          }
          const comments = this.state.comments.filter(
            comment => el.id === comment.todoId
          );
          const commentsLength = comments.length;
          const commentReads = comments.map(el => el.read);
          const user = this.state.users.find(user => user.id === el.userId) || {};
          const userId = user.id || "";
          return (
            <Todo
              key={i}
              title={<p className="title">{el.title}</p>}
              commentsLength={commentsLength}
              status={el.status}
              index={i}
              arrI={arrI}
              stuckTimer={el.stuckTimer}
              state={el.state ? el.state : "Delete"}
              date={date}
              todoId={el.id}
              timer={el.timer}
              url={el.id}
              endTime={el.endTime}
              userId={userId}
              userImg={user.url || Img}
              userName={user.name}
              clone={el.clone || undefined}
              cloneDate={this.cloneDate}
              commentReads={commentReads}
              board={this.state.board || "todos"}
              deleteOne = {this.deleteOne}
              getTodos={this.getTodos}
            />
          );
        });
      } else{
        return;
      }
    }
  };
  deleteOne = todoId => { 
    this.setState({isLoading:true});
    db.collection(this.state.board)
      .doc(todoId)
      .delete()
      .then(()=>{
        this.getTodos()
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };
  add = () => {
    this.setState({ add: false });
    let picker = document.querySelector(".valuePicker");
    const title = picker.selectedOptions[0].innerText;
    let status = this.refs.status.innerText;
    let date = this.refs.date.value
      ? new Date(this.refs.date.value).getTime()
      : "";
    const userId = this.state.userId;
    if (date === "") {
      this.refs.date.style.color = "red";
    } else if (picker.selectedIndex === 0) {
      picker.style.color = "red";
      picker.selectedOptions[0].innerText = "Please Select a Task";
    } else if (this.state.userId === "") {
      return;
    } else {
      this.setState({ isLoading: true });
      db.collection(this.state.board || "todos")
        .add({ title, userId, status, date })
        .then(() => {
          this.setState({ todoId: 1 });
          this.getTodos();
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  };
  //!for deleting all todos
  deleteAll = todoIds => {
    this.setState({isLoading:true})
    todoIds.forEach(el => {
      db.collection(this.state.board || "todos")
        .doc(el)
        .delete()
        .then(() => {
          this.getTodos()
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    });
  };
  render() {
    return (
      this.state.boardLoading ? <div className="loader_wrapper">
        <div className="loader"></div>
      </div> : <div>
        <Goal board={this.state.board || "todos"} />
        <SideNav
          page="admin_panel"
          board={this.state.board}
          history={this.props.history}
        />
        <div className="container mx-auto pt-16">
          <div className="left  justify-end mb-6">
            <Link
              className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
              to="/admin_forgot"
            >
              Change Password
            </Link>
          </div>
          {this.state.clone ? (
            <button
              onClick={()=>{
                this.setState({isLoading: true,clone: false});
                this.getTodos()
                
              }}
              className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
            >
              Go Back
            </button>
          ) : this.state.add ? (
            <button
              className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
              onClick={()=> this.setState({add: false})}
            >
              Go Back
            </button>
          ) : (
            <Link
              className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
              to="/"
            >
              Go Back
            </Link>
          )}
          {this.state.clone ? (
            <button
              onClick={() => {
                const getArray = value =>
                  Array.from(
                    document.querySelector("#panel-0").querySelectorAll(value)
                  );
                const titles = getArray("td .title");
                const userIds = getArray("td .userId");
                const statuses = getArray("td .status");
                const dates = getArray('td input[type="date"]');
                const isDatePresent = dates.find(el => el.value === "");
                const newTodos = titles.map((el, i) => {
                  return {
                    title: el.textContent,
                    userId: userIds[i].textContent,
                    status: statuses[i].textContent,
                    date: new Date(dates[i].value).getTime()
                  };
                });
                const isUserPresent = newTodos.find(el => el.userId === "");
                if (isUserPresent) return alert("Please Select All Users");
                if (isDatePresent) return alert("Please Select All Dates");
                this.setState({isLoading: true})
                newTodos.forEach(todo => {
                  db.collection(this.state.board || "todos")
                    .add(todo)
                    .then(() => {
                      this.getTodos()
                    });
                });
              }}
              className="rounded px-4 py-2 text-center bg-green-600 border border-purple-600 ml-3 text-white cursor-pointer justify-between outline-none mt-8"
            >
              Clone
            </button>
          ) : (
            ""
          )}

          <div className="flex justify-end mb-6">
            <button
              className="rounded px-4 py-2 text-center border border-purple-600 text-purple-600 mr-3 bg-white-600 text-white outline-none cursor-pointer"
              id="add_task_btn"
              onClick={this.handleClick}
            >
              Add Task
            </button>
            <Link
              to="/all_user"
              style={{
                marginRight: "10px",
                paddingTop: "10px"
              }}
              className="rounded px-4 py-2 text-center border border-purple-600 bg-yellow-600 text-white cursor-pointer outline-none"
            >
              Manage Team
            </Link>
            <Link
              to="/all_tasks"
              className="rounded px-4 py-2 text-center border border-purple-600 bg-green-600 text-white cursor-pointer outline-none"
              id="manage_pupil_btn"
              style={{
                paddingTop: "10px"
              }}
            >
              Manage Tasks
            </Link>
            <button
              className="rounded px-4 py-2 text-center bg-red-800 text-white cursor-pointer ml-3 outline-none"
              id="delete_all_btn"
              onClick={() => this.deleteAll(this.state.todoIds)}
            >
              Delete All
            </button>
            <button
              className="rounded px-4 py-2 text-center bg-blue-300 text-white cursor-pointer ml-3 outline-none"
              id="clone_all_btn"
              onClick={() => this.cloneAll(this.state.todoIds)}
            >
              Clone All
            </button>
          </div>
          {this.state.isLoading ? (
            <div className="loader_wrapper">
              <div className="loader"></div>
            </div>
          ) : (
            <div ref="tables">
              {this.state.add ? (
                <Collapsible
                  date="New Todo"
                  active={true}
                  i={-1}
                  content={this.showNewTodo()}
                />
              ) : ( 
                ""
              )}
              {this.showTables()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Table extends Component {
  static contextType = AuthContext;
  state = {
    match: {}
  };
  componentDidMount() {
    setTimeout(() => {
      if (!this.context.isAuthenticated) {
        this.props.history.push("/admin-login");
      }
    }, 7000);
  }
  UNSAFE_componentWillReceiveProps (props) {
    this.setState({ match: props.match });
  }
  render() {
    return this.context.isAuthenticated ? (
      <Index match={this.state.match} history={this.props.history} />
    ) : (
      <div></div>
    );
  }
}

export default Table;
