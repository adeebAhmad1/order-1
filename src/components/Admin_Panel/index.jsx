import React, { Component } from "react";
import { Link } from "react-router-dom";
//components
import Todo from "./Table/todo";
import Button from "../utils/Button";

//firebase
import { db } from "../../config/firebase";

//context
import { AuthContext } from "../../context/AuthContext";

//images
import Img from "../../images/person.jpg";

class index extends Component {
  static contextType = AuthContext;
  state = {
    todos: [],
    todoIds: []
  };

  //for getting all todos
  componentDidMount = () => {
    db.collection("todos").onSnapshot(querySnapshot => {
      let todos = [];
      const todoIds = []
      querySnapshot.forEach(doc => {
        let todo = doc.data();
        todoIds.push(doc.id)
        todos.push(todo);
      });
      this.setState({ todos,todoIds });
    });
  };


 





  //for new todo
  handleClick = () => {
    const newTodo = {
      title: (
        <input
          // pattern="\d{1,2}/\d{1,2}/\d{4}"
          required
          className="valuePicker"
          name="title"
          placeholder="title"
        />
      ),
      // commentsLength: 0,
      personImg: Img,
      tracking: "1 Hour",
      state: "Add",
      status: "Not Started",
      selectUserIndex : 0,

    };
    this.setState({ todos: [...this.state.todos, newTodo] });
  };
  showTodos = () =>
    this.state.todos.map((el, i) => {
      let date
      if(el.date){
        let dateArray = el.date.split("-");
        date = [dateArray[2], dateArray[0], dateArray[1]].join("-");
      }
      return (
          // console.log(el.selectUserIndex)
        <Todo
          key={i}
          title={el.title}
          commentsLength={0}
          status={el.status}
          index={i}
          selectUserIndex={el.selectUserIndex}
          state={el.state? el.state : "Delete"}
          date={date}
          todoId ={this.state.todoIds[i]}
          timer={el.timer}

        />
        );
      });
    deleteAll = (todoIds) => {
      todoIds.forEach(el=>{
        db.collection("todos").doc(el).delete()
        .then(() => {
          console.log("deleted")
        }).catch( (error)=> {
            console.error("Error removing document: ", error);
        });
      })
    }
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
            onClick={()=>this.deleteAll(this.state.todoIds)}
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
                Tasks
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
