import React, { Component } from "react";

//firebase
import { db } from "../../../config/firebase";
import { Link } from "react-router-dom";

class EditUser extends Component {
  state = {
    name: "",
    url: "",
    users: {}
  };

  //getting values in state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount(){
    db.collection("users")
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          let user = doc.data();
          user.id = doc.id;
          users.push(user);
        });
        const {name,url} = users.find(el=> el.id === this.props.match.params.userId) || {name: "",url:""};

        this.setState({name,url});
      });
  }
  handleSubmit = (userId, e) => {
    e.preventDefault();
    let name = this.state.name;
    let url = this.state.url;
    db.collection("users")
      .doc(userId)
      .update({
        name,
        url
      })
      .then(() => {
        this.props.history.push("/all_user");
      });
  };

  render() {
    return (
      <div className="outer">
        <Link
          to="/all_user"
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
            onSubmit={e => this.handleSubmit(this.props.match.params.userId, e)}
          >
            <div className="">
              <input
                placeholder="Name"
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
              />
            </div>
            <div className="">
              <input
                placeholder="Image URL"
                name="url"
                onChange={this.handleChange}
                value={this.state.url}
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

export default EditUser;