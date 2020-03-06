import React, { Component } from "react";
import { db } from "../../config/firebase";
class Comments extends Component {
  state = {
    comments: [],
    commentIndex: null,
    users: [],
    content: "",
    userId: "",
    todoId: ""
  };

  handleDropdown = () => {
    this.refs.dropdown.classList.toggle("block");
  };
  selectOption = e => {
    const i = e.target.dataset.id || e.target.parentNode.dataset.id;
    this.setState({ userId: this.state.users[i] });
    this.setState({ todoId: this.props.match.params.commentId });
    this.refs.image.style.backgroundImage = `url(${this.state.users[i].url})`;
    this.refs.name.innerHTML = this.state.users[i].name;
  };
  handleUpdate = e => {
    e.preventDefault();
    console.log(this.state);
    db.collection("comments")
      .add({
        content: this.state.content,
        userId: this.state.userId,
        todoId: this.state.todoId,
        date: new Date().getTime()
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        this.props.history.push("/");
        this.setState({ content: "" });
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };
  componentDidMount() {
    //! for rendering user from database
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      this.setState({
        users,
        userId: users[0].id,
        todoId: this.props.match.params.commentId
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
      comments = comments.filter(el=>{
        return el.todoId === this.props.match.params.commentId
      })
      this.setState({
        comments
      });
    });
  }
  showUsers = () => {
    return this.state.users.map((el, i) => (
      <li
        key={i}
        onClick={this.selectOption}
        className="border-b border-gray-300 text-green-600 h-12 flex flex-start items-center px-4 cursor-pointer"
        data-id={i}
      >
        <span
          className=" rounded-full bg-cover block"
          style={{
            backgroundImage: `url(${el.url})`,
            width: "30px",
            height: "30px"
          }}
        ></span>
        <p className="ml-3">{el.name}</p>
      </li>
    ));
  };

  //! showComments

  showComments = () => {
    return this.state.comments.map((comment, i) => {
      const user = this.state.users.find(el=> el.id === comment.userId);
        return (
          <article
            className="mt-10 p-6 border border-gary-600 rounded-lg"
            key={i}
          >
            <div className="flex justify-between items-center">
              <a
                href="/"
                className="flex text-gray-500 hover:text-purple-600"
              >
                <div
                  className="h-12 w-12 bg-cover rounded-full mx-auto"
                  style={{
                    backgroundImage: `url(${user.url})`
                  }}
                ></div>
                <p className="ml-2 flex self-center">{user.name}</p>
              </a>
            </div>
            <p className="text-base pt-6">{comment.content}</p>
          </article>
        );
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div className="fixed w-screen h-screen fixed top-0 left-0 z-50 bg-popup overflow-y-auto">
        <div className="center bg-white p-8 container rounded-lg center" style={{transform: `translate(-50%,0%)`}}>
          <div className="flex justify-end mb-4">
            <i
              onClick={this.props.history.goBack}
              className="fa fa-times text-lg cursor-pointer text-gray-700"
              aria-hidden="true"
              style={{ fontSize: "1.5em" }}
            ></i>
          </div>
          <div className="mt-10 update-section" id="Update_section">
            <p className="text-purple-600 text-xl text-left capitalize mr-6 font-bold text-xl">
              Select comment
            </p>
            <div
              onClick={this.handleDropdown}
              className="flex text-gray-500x my-4"
            >
              <div
                ref="image"
                className="h-full bg-cover rounded-full  bg-gray-300 relative pic-wrapper"
                style={{
                  backgroundImage: `url(${
                    this.state.users.length > 0 ? this.state.users[0].url : ""
                  })`,
                  width: "40px",
                  height: "40px"
                }}
              >
                <ul
                  ref="dropdown"
                  className="absolute top-0 mt-12 shadow-xl -mr-2 left-0 w-48 bg-white dropdown z-50 capitalize hidden status_priority_dropdown rounded-lg"
                  style={{ width: `17.5rem` }}
                >
                  {this.showUsers()}
                </ul>
              </div>
              <p className="ml-2 flex self-center" ref="name">
                {" "}
                {this.state.users.length > 0 ? this.state.users[0].name : ""}
              </p>
            </div>
            <form action="/" onSubmit={this.handleUpdate}>
              <textarea
                onChange={this.handleChange}
                name="content"
                className="w-full py-3 px-6 border border-gary-600 rounded-lg text-sm text-black outline-none focus:border-purple-600 overflow-hidden"
                placeholder="Write an Update..."
                required
                value={this.state.content}
              >
              </textarea>
              <div className="flex justify-between items-center mt-4">
                <button className="rounded px-8  py-2 text-center bg-purple-600 text-white cursor-pointer justify-between outline-none">
                  Comment
                </button>
              </div>
            </form>
          </div>
          {this.showComments()}
        </div>
      </div>
    );
  }
}

export default Comments;
