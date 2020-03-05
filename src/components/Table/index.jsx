import React, { Component } from "react";

//firebase
import { db } from "../../config/firebase";

//components
import Todo from "./todo";

class Table extends Component {
  state = {
    users: [],
    todos: []
  };

  //! getting data from fatabase
  componentDidMount = () => {
    //for users
    db.collection("todos").onSnapshot(querySnapshot => {
      let todos = [];
      querySnapshot.forEach(doc => {
        let todo = doc.data();
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
  };

  //! show todos from database
  showTodos = () => {
    return this.state.todos.map((el, i) => {
      if (this.state.users.length > 0) {
        return (
          
          <Todo
            key={i}
            title={el.title}
            index={i}
            status={el.status}
            date={el.date}
            // commentsLength={2}
            assignedUser={this.state.users[el.selectUserIndex].url}
          />
        );
      } else {
        return (
        <tr>
          <td></td>
        </tr>
        )
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
