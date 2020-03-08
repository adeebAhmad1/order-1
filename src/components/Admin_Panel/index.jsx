import React, { Component } from "react";
import { Link } from "react-router-dom";
//components
import Todo from "./Table/todo";
import firebase from "../../config/firebase"
//firebase
import  { db } from "../../config/firebase";

//context
import { AuthContext } from "../../context/AuthContext";

class index extends Component {
  static contextType = AuthContext;
  state = {
    todos: [],
    todoIds: [],
    tasks: [],
    comments: [],
    users: []
  };

  componentDidMount = () => {
    //! for getting all todos
    db.collection("todos")
      .get()
      .then(querySnapshot => {
        let todos = [];
        const todoIds = [];
        querySnapshot.forEach(doc => {
          let todo = doc.data();
          todo.id = doc.id;
          todoIds.push(doc.id);
          todos.push(todo);
        });
        this.setState({ todos, todoIds });
      });
    //! getting tasks from fatabase
    db.collection("tasks")
      .get()
      .then(querySnapshot => {
        let tasks = [];
        querySnapshot.forEach(doc => {
          let task = doc.data();
          tasks.push(task);
        });
        this.setState({ tasks });
      });
    //! for rendering comments from database
    db.collection("comments")
      .get()
      .then(querySnapshot => {
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
          users
        });
      });
  };

  //!dropdown for tasksvalues
  showTasksValues = () =>
    this.state.tasks.map((task, i) => (
      <option value={task.title} key={i}>
        {task.title}
      </option>
    ));

  //! for new todo
  handleClick = () => {
    const newTodo = {
      title: <select className="valuePicker" defaultValue={"select"}>
        <option disabled value="select">Select Task</option>
        {this.showTasksValues()}</select>,
      state: "Add",
      status: "Not Started",
      timer: ""
    };
    this.setState({ todos: [...this.state.todos, newTodo] });
  };

  //! for rendering all todos
  showTodos = () =>
    this.state.todos.map((el, i) => {
      let date;
      if (el.date) {
        let dateArray = el.date.split(" ").join("").split("/");
        date = [dateArray[2],dateArray[0] >= 10 ? dateArray[0] : "0"+ dateArray[0]  , dateArray[1] >= 10 ? dateArray[1] : "0"+ dateArray[1]].join("-");
      }
      const commentsLength = this.state.comments.filter(
        comment => el.id === comment.todoId
      ).length;
      const user = this.state.users.find(user => user.id === el.userId) || {};
      const userId = user.id || "";
      console.log(this.state.users, el.userId);
      return (
        <Todo
          key={i}
          title={<p> {el.title} </p>}
          commentsLength={commentsLength}
          status={el.status}
          index={i}
          state={el.state ? el.state : "Delete"}
          date={date}
          todoId={el.id}
          timer={el.timer}
          url={el.id}
          endTime={el.endTime}
          userId={userId}
        />
      );
    });

  //!for deleting all todos
  deleteAll = todoIds => {
    todoIds.forEach(el => {
      db.collection("todos")
        .doc(el)
        .delete()
        .then(() => {
          window.location.reload();
          console.log("deleted");
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    });
  };
  render() {
    return (
      <div className="container mx-auto pt-16">
        <div className="left  justify-end mb-6">
          {" "}
          <Link
            className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
            to="/"
            onClick={()=>{
              firebase
                .auth()
                .signOut()
                .then(() => {})
                .catch(error => {
                  // An error happened.
                  alert(error);
                })
            }}
          >
            Sign Out
          </Link>
          <Link
            className="rounded px-8 ml-3 py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none"
            to="/admin_forgot"
          >
            Change Password
          </Link>
        </div>

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
            Manage People
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
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th width="35%" className="text-purple-600 text-xl text-left">
                Tasks
              </th>
              <th>People</th>
              <th width="15%">Status</th>
              <th width="25%">Timeline</th>
              <th>Time Tracking</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody ref="tbody">{this.showTodos()}</tbody>
        </table>
        <div className="flex justify-end mb-4">
          <Link className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8" to="/">
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}

export default index;
