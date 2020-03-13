import React, { Component } from "react";

//firebase
import { db } from "../../../config/firebase";
import { Link } from "react-router-dom";

class EditTask extends Component {
  state = {
    title: "",
    tasks: {}
  };

  //! getting values in state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount() {
    db.collection("tasks")
      .get()
      .then(querySnapshot => {
        let tasks = [];
        querySnapshot.forEach(doc => {
          let task = doc.data();
          task.id = doc.id;
          tasks.push(task);
        });
        const { title } = tasks.find(
          el => el.id === this.props.match.params.taskId
        ) || { title: "" };

        this.setState({ title });
      });
  }
  handleSubmit = (taskId, e) => {
    e.preventDefault();
    let title = this.state.title;
    console.log(title)
    db.collection("tasks")
      .doc(taskId)
      .update({
        title
      })
      .then(() => {
        this.props.history.push("/all_tasks");
      });
  };

  render() {
    return (
      <div className="outer">
        <Link
          to="/all_tasks"
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `100vh`
          }}
        ></Link>

        <div className="inner">
          <form
            method="get"
            onSubmit={e => this.handleSubmit(this.props.match.params.taskId, e)}
          >
            <div className="">
              <input
                placeholder="Title"
                name="title"
                onChange={this.handleChange}
                value={this.state.title}
              />
            </div>
            <div className="">
              <button className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditTask;
