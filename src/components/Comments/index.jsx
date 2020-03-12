import React, { Component } from "react";
import { db } from "../../config/firebase";
import img from "../../images/no_image.jpg";
class Comments extends Component {
  state = {
    comments: [],
    commentIndex: null,
    users: [],
    content: "",
    userId: "",
    todoId: "",
    todo: {},
    name: ""
  };
  removeDropDown = (e)=>{
    if(e.target.classList.contains("dropdown2")) return;
    console.log("Removed")
    this.refs.dropdown.classList.remove("block")
  }
  handleDropdown = () => {
    this.refs.dropdown.classList.toggle("block");
  };
  selectOption = e => {
    const id = e.target.dataset.id || e.target.parentNode.dataset.id;
    const user = this.state.users.find(el => el.id === id);
    this.setState({ userId: user.id });
    this.setState({ todoId: this.props.match.params.commentId });
    this.refs.image.style.backgroundImage = `url(${user.url})`;
    this.refs.name.innerHTML = user.name;
    this.setState({name:user.name})
  };
  handleUpdate = e => {
    e.preventDefault();
    if(this.state.name === ""){
      this.refs.name.innerHTML = "Please Select a User";
      this.refs.name.style.color = "red"
      return false
    }
    else{
      db.collection("comments")
      .add({
        content: this.state.content,
        userId: this.state.userId,
        todoId: this.state.todoId,
        date: new Date().getTime()
      })
      .then(docRef => {
        this.props.history.push("/");
        this.setState({ content: "" });
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
    }
  };
  componentWillUnmount = ()=> window.removeEventListener("click",this.removeDropDown)
  componentDidMount() {
    window.addEventListener("click",this.removeDropDown)
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
      db.collection("todos").onSnapshot(querySnapshot => {
        let todos = [];
        querySnapshot.forEach(doc => {
          let todo = doc.data();
          todo.id = doc.id;
          todos.push(todo);
        });
        const todo = todos.find(
          el => el.id === this.props.match.params.commentId
        );
        const userTodo = this.state.users.find(el => el.id === todo.userId);
        todo.url = userTodo.url || img;
        this.setState({ todo });
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
      comments = comments.filter(
        el => el.todoId === this.props.match.params.commentId
        );
        comments.sort((a,b)=>b.date-a.date)
      this.setState({ comments })
    });
  }
  showUsers = () => {
    return this.state.users.map((el, i) => (
      <li
        key={i}
        onClick={this.selectOption}
        className="border-b border-gray-300 text-green-600 h-12 flex flex-start items-center px-4 cursor-pointer"
        data-id={el.id}
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
      const user = this.state.users.find(el => el.id === comment.userId);
      if (user) {
        return (
          <article
            className="mt-10 p-6 border border-gary-600 rounded-lg"
            key={i}
          >
            <div className="flex justify-between items-center">
              <div  className="flex text-gray-500 hover:text-purple-600">
                <div
                  className="h-12 w-12 bg-cover rounded-full mx-auto"
                  style={{
                    backgroundImage: `url(${user.url})`
                  }}
                ></div>
                <p className="ml-2 flex self-center">{user.name}</p>
              </div>
              <p className="select appearance-none py-1 pl-6 pr-8 outline-none text-gray-500 cursor-pointer">
                {" "}
                {new Date(comment.date).toLocaleTimeString()}{" "}
                {new Date(comment.date).toDateString()}{" "}
              </p>
            </div>
            <p className="text-base pt-6">{comment.content}</p>
          </article>
        );
      } else {
        return (
          <article
            className="mt-10 p-6 border border-gary-600 rounded-lg"
            key={i}
          ></article>
        );
      }
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div className="fixed w-screen h-screen fixed top-0 left-0 z-50 bg-popup overflow-y-auto">
        <div
          className="center bg-white p-8 container rounded-lg center"
          style={{ transform: `translate(-50%,0%)` }}
        >
          <div className="myDiv">
            <div className="personImg">
              <img src={this.state.todo.url} alt="" />
            </div>
            <div className="personTask">{this.state.todo.title}</div>
          </div>
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
              Who is Commenting?
            </p>
            <div

              onClick={this.handleDropdown}
              className="flex text-gray-500x my-4 dropdown2"
            >
              <div
                ref="image"
                className="h-full bg-cover rounded-full  bg-gray-300 relative pic-wrapper dropdown2"
                style={{
                  backgroundImage: `url(${img})`,
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
              <p className="ml-2 flex self-center dropdown2" ref="name">
                Select User
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
              ></textarea>
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
