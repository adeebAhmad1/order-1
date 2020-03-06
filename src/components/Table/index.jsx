import React, { Component } from "react";

//firebase
import { db } from "../../config/firebase";

//components
import Todo from "./todo";

class Table extends Component {
  state = {
    users: [],
    todos: [],
    comments: []
  };

  //! getting data from fatabase
  componentDidMount = () => {
    //for users
    db.collection("todos").onSnapshot(querySnapshot => {
      let todos = [];
      querySnapshot.forEach(doc => {
        let todo = doc.data();
        todo.id = doc.id;
        todos.push(todo);
      });
      this.setState({
        todos
      });
    });

    //for users
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        users.push(user);
      });
      this.setState({
        users
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
      comments = comments.filter(el => {
        return el.todoId;
      });
      this.setState({
        comments
      });
    });
  };

  //! show todos from database
  showTodos = () => {
    return this.state.todos.map((el, i) => {
      if (this.state.users.length > 0) {
        const commentsLength = this.state.comments.filter(comment => {
          return el.id === comment.todoId;
        }).length;
        return (
          <Todo
            key={i}
            title={el.title}
            index={i}
            status={el.status}
            date={el.date}
            commentsLength={commentsLength}
            assignedUser={this.state.users[el.selectUserIndex].url}
            url={el.id}
          />
        );
      } else {
        return <tr key={i}></tr>;
      }
    });
  };

  render() {
    return (
      <div>
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
            </tr>
          </thead>
          <tbody>{this.showTodos()}</tbody>
        </table>
      </div>
    );
  }
}

export default Table;
