import React, { Component } from "react";
import { Link } from "react-router-dom";

//firebase
import { db } from "../../../config/firebase";

class Allusers extends Component {
  state = {
    users: [],
    userIds: []
  };

  componentDidMount = () => {
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      let userIds = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        userIds.push(doc.id);
        users.push(user);
      });
      this.setState({ users, userIds });
    });
  };

  //! handle submit for deleting user
  deleteOne = userId => {
    db.collection("users")
      .doc(userId)
      .delete()
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };

  //! rendering user from database
  showUsers = () => {
 

 //! for sorting
 let sortedusers = this.state.users.sort((a, b) => {
  return a.name.localeCompare(b.name);
});


    return sortedusers.map((user, i) => {
      return (
        <tr key={i}>
          <td>
            {" "}
            <img
              src={user.url}
              alt={user.name}
              width="100px"
              height="100px"
            />{" "}
          </td>
          <td> {user.name} </td>
          <td>
            <Link
              to={`/all_users/edit_user/${this.state.userIds[i]}`}
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
              style={{ width: "100px" }}
              onClick={() => this.deleteOne(this.state.userIds[i])}
              className="rounded px-4 py-2  text-center bg-red-600 text-white cursor-pointer outline-none"
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
        <Link to="/all_user/add_user">
          <button
            className="rounded px-4 py-2 text-center bg-purple-600 text-white cursor-pointer outline-none"
            id="manage_pupil_btn"
          >
            Add user
          </button>
        </Link>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>{this.showUsers()}</tbody>
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

export default Allusers;
