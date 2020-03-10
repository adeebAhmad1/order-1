import React, { Component } from "react";
import { Link } from "react-router-dom";

//firebase
import { db } from "../../../config/firebase";

class AllTasks extends Component {
  state = {
    tasks: [],
    taskIds: []
  };

  componentDidMount = () => {
    db.collection("tasks").onSnapshot(querySnapshot => {
      let tasks = [];
      let taskIds = [];
      querySnapshot.forEach(doc => {
        let task = doc.data();
        taskIds.push(doc.id);
        tasks.push(task);
      });
      this.setState({ tasks: tasks, taskIds: taskIds });
    });
  };

  //! handle submit for deleting task
  deleteOne = taskId => {
    db.collection("tasks")
      .doc(taskId)
      .delete()
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };

  showTasks = () => {
    //! for sorting
    let sortedTasks = this.state.tasks.sort((a, b) => {
      console.log(a, b);
      return a.title.localeCompare(b.title);
    });
    return sortedTasks.map((task, i) => {
      return (
        <tr key={i}>
          <td>{task.title}</td>
          <td>
            <button
              onClick={() => this.deleteOne(this.state.taskIds[i])}
              className="rounded px-4 py-2 text-center bg-red-600 text-white cursor-pointer outline-none"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        <Link to="/all_tasks/add_task">
          <button
            className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none"
            id="manage_pupil_btn"
          >
            Add task
          </button>
        </Link>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title of Task</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>{this.showTasks()}</tbody>
        </table>
        <div className="flex justify-end mb-4">
          <Link
            className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
            to="/admin_panel"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}

export default AllTasks;
