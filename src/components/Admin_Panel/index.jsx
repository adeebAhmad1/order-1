import React, { Component } from "react";
import { Link } from "react-router-dom";
//components
import Todo from "./Table/todo";
import Button from "../utils/Button";

//context
import { AuthContext } from "../../context/AuthContext";

//images
import Img from "../../images/person.jpg";

class index extends Component {
  static contextType = AuthContext;
  state = {
    todos: [
      {
        title: "Testing",
        commentsLength: 2,
        personImg: Img,
        tracking: "1 Hour",
        state:"Delete"
      }
    ]
  };
  handleClick = () => {
    const newTodo = {
      title: (
        <input name="title" placeholder="title" />
      ),
      commentsLength: 0,
      personImg: Img,
      tracking: "1 Hour",
      state:"Add"
    };
    this.setState({ todos: [...this.state.todos, newTodo] });
  };
  showTodos = () =>
    this.state.todos.map((el, i) => (
      <Todo 
      key={i}
        title={el.title}
        commentsLength={el.commentsLength}
        personImg={el.personImg}
        tracking={el.tracking}
        index={i}
        state={el.state}
        
      />
    ));
  render() {
    return (
      <div className="container mx-auto pt-16">
        <div className="flex justify-end mb-6">
          <button
            className="rounded px-4 py-2 text-center border border-purple-600 text-purple-600 mr-3 bg-white-600 text-white outline-none cursor-pointer"
            id="add_task_btn"
            onClick={this.handleClick}
          >
            Add Task
          </button>
          <Link to="/all_user">
            <button
              className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none"
              id="manage_pupil_btn"
            >
              Manage People
            </button>
          </Link>
          <button
            className="rounded px-4 py-2 text-center bg-red-800 text-white cursor-pointer ml-3 outline-none"
            id="delete_all_btn"
          >
            Delete All
          </button>
          <Button
            link="/admin-login"
            name={this.context.isAuthenticated ? "Sign OUT" : "Sign IN"}
          />
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th width="35%" className="text-purple-600 text-xl text-left">
                This Week's Status
              </th>
              <th>People</th>
              <th width="20%">Status</th>
              <th width="25%">Timeline</th>
              <th>Time Tracking</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody ref="tbody">{this.showTodos()}</tbody>
        </table>
        <div className="flex justify-end mb-4">
          <Link
            className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
            to="/"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}

export default index;
