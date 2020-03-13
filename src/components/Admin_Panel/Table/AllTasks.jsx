import React, { Component } from "react";
import { Link } from "react-router-dom";

//firebase
import { db } from "../../../config/firebase";

class AllTasks extends Component {
  state = {
    tasks: []
  };

  componentDidMount = () => {
    db.collection("tasks").onSnapshot(querySnapshot => {
      let tasks = [];
      let taskIds = [];
      let sortedTasks = [];
      querySnapshot.forEach(doc => {
        let task = doc.data();
        task.id = doc.id
        tasks.push(task);
      });
      //! for sorting
      sortedTasks = tasks.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      taskIds = sortedTasks.map(el=> el.id) || [];
      this.setState({ tasks: sortedTasks, taskIds: taskIds });
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
    return this.state.tasks.map((task, i) => {
      return (
        <tr key={i}>
          <td>{task.title}</td>
          <td>
            <Link
              to={`/all_tasks/edit_task/${this.state.taskIds[i]}`}
              className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none"
              style={{
                display: "inline-block",
                width: "100px",
                marginRight: "4px"
              }}
            >
              Edit
            </Link>
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
        <div className="flex justify-end mb-4">
          <Link
            className="rounded px-4 py-2 text-center bg-white-600 border border-purple-600 ml-3 text-purple-600 cursor-pointer justify-between outline-none mt-8"
            to="/admin_panel"
          >
            Go Back
          </Link>
        </div>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title of Task</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>{this.showTasks()}</tbody>
        </table>
        
      </div>
    );
  }
}

export default AllTasks;
