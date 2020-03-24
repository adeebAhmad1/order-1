import React, { Component } from "react";

//firebase
import { db } from "../../config/firebase";

//components
import Todo from "./todo";
import Collapsible from "../utils/Collapsible";

class Table extends Component {
  state = {
    users: [],
    todos: [],
    comments: [],
    readComment: [],
    group: {}
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
        todos.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        todos.sort((a, b) => {
          return b.date - a.date;
        });
        this.setState({todos});
        const group = {};
        this.state.todos.forEach(el => {
          const date = new Date(el.date + new Date().getTimezoneOffset()*60*1000).toDateString();
          if (date in group) {
            group[date].push(el);
          } else {
            group[date] = new Array(el);
          }
        });
        this.setState({ group });
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
                  <th>Time Tracking</th>
                </tr>
              </thead>
              <tbody ref="tbody">{this.showTodos(todos[i],i)}</tbody>
            </table>
          }
          i={i}
          date={el}
        />
      );
    });
  };


  //! show todos from database
  showTodos = (todos,arrayIndex) => {
    return todos.map((el, i) => {
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
            arrI={arrayIndex}
            timer={el.timer}
            endTime={el.endTime ? el.endTime : ""}
            todoId={el.id}
            userId={userId}
            commentReads={commentReads}
            stuckTimer={el.stuckTimer}
          />
        );
      } else {
        return <tr key={i}></tr>;
      }
    });
  };

  render() {
    return (
      <div style={{marginTop: `30px`}}>
        {this.showTables()}
      </div>
    );
  }
}

export default Table;
