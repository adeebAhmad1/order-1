import React, { Component } from "react";
import { db } from "../../config/firebase";
import { Link } from "react-router-dom";

class SideNav extends Component {
  state = {
    collections: [],
    board: null
  };
  componentDidMount() {
    this.setState({ board: this.props.board });
    db.collection("collections").onSnapshot(snapShot => {
      const collections = [];
      snapShot.forEach(doc => {
        const collection = doc.data();
        collection.id = doc.id;
        collections.push(collection);
      });
      if (collections.length === 0)
        db.collection("collections")
          .add({ name: "todos" })
          .then(() => console.log("SUCCESS"));
      this.setState({ collections });
    });
    this.refs.main.addEventListener("mouseenter", () => {
      if (!this.refs.main.classList.contains("main-active"))
        this.refs.icon.classList.add("resize-icon");
    });
    this.refs.main.addEventListener("mouseleave", () => {
      if (!this.refs.main.classList.contains("main-active"))
        this.refs.icon.classList.remove("resize-icon");
    });
    this.refs.icon.addEventListener("click", () => {
      this.refs.icon.classList.toggle("resize-icon");
      this.refs.main.classList.toggle("main-active");
    });
  }
  componentWillReceiveProps(props) {
    this.setState({ board: props.board });
  }
  deleteCollection = e => {
    const target = e.target.dataset || e.target.parentNode.dataset;
    db.collection("collections")
      .doc(target.id)
      .delete()
      .then(() => {
        console.log(db.collection(target.name))
        db.collection(target.name)
          .get()
          .then(snapShot => {
            const boardIds = [];
            snapShot.forEach(doc => {
              boardIds.push(doc.id);
            });
            boardIds.forEach(el => {
              db.collection(target.name)
                .doc(el)
                .delete()
                .then(() => {
                  window.location.replace("/admin_panel/todos")
                });
            });
          });
      });
  };
  showItems = () =>
    this.state.collections.map((el, i) => (
      <li key={i} className={this.state.board === el.name ? "item-active" : ""}>
        {this.state.board === el.name ? (
         <Link to={`/${this.props.page}/${el.name}`}>{el.name ==="todos" ? "Client Relations": el.name}</Link>
        ) : (
          <a href={`/${this.props.page}/${el.name}`}>{el.name ==="todos" ? "Client Relations": el.name}</a>
        )}
        {this.props.page === "home" ? (
          ""
        ) : el.name === "todos" ? (
          ""
        ) : (
          <i
            data-name={el.name}
            data-id={el.id}
            onClick={this.deleteCollection}
            className="fas fa-trash-alt trash-icon"
          ></i>
        )}
      </li>
    ));
  render() {
    return (
      <div style={{ position: `relative` }}>
        <div className="icon_wrapper" ref="icon">
          <i className="fas fa-angle-left"></i>
        </div>
        <header className="main-head" ref="main">
          <nav className="head-nav">
            <ul className="menu">
              <li>
                <Link
                  to="/"
                  onClick={e => e.preventDefault()}
                  style={{ fontSize: `35px` }}
                >
                  Boards
                </Link>
              </li>
              {this.showItems()}
              {!(this.props.page === "home") ? (
                <li>
                  <Link to="/admin_panel/add_board">
                    <i className="fas fa-plus-circle">
                      {" "}
                      <span>Add Board</span>
                    </i>
                    &nbsp;
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default SideNav;
