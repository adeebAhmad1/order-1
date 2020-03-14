import React, { Component } from "react";

//firebase
import { db } from "../../config/firebase";

//components
import Todo from "./todo";

class Table extends Component {
  state = {
    users: [],
    todos: [],
    comments: [],
    readComment: []
  };

  //! getting data from fatabase
  componentDidMount = () => {
    //! for todos
    db.collection("todos")
      .get()
      .then(querySnapshot => {
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

    //! for users
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
  };

  //! show todos from database
  showTodos = () => {
    //! for sorting
    let sortedTodos = this.state.todos.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });

    return sortedTodos.map((el, i) => {
      if (this.state.users.length > 0) {
        const comments = this.state.comments.filter(comment => {
          return el.id === comment.todoId;
        });
        const commentsLength = comments.length;
        const commentReads = comments.map(el=>el.read)
        const user = this.state.users.find(user => user.id === el.userId) || {};
        const userId = user.id || "";
        return (
          <Todo
            key={i}
            title={el.title}
            index={i}
            status={el.status}
            date={el.date}
            commentsLength={commentsLength}
            url={el.id}
            timer={el.timer}
            endTime={el.endTime ? el.endTime : ""}
            todoId={el.id}
            userId={userId}
            commentReads={commentReads}
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
        {console.log(this.state.readComments)}
        <table className="w-full">
          <thead>
            <tr>
              <th width="35%" className="text-purple-600 text-xl text-left">
                Tasks
              </th>
              <th>Team</th>
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
