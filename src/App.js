//dependicies
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

//components

import Header from "./components/layout/Header";

import Home from "./components/Home";

import Login from "./components/Login";
import Forgot from "./components/Forgot";

import Comments from "./components/Comments";

import Admin_Panel from "./components/Admin_Panel";

import Add_user from "./components/Admin_Panel/Table/New/Employe";
import Edit_user from "./components/Admin_Panel/Table/EditUser";
import All_user from "./components/Admin_Panel/Table/Allusers";

import Add_Task from "./components/Admin_Panel/Table/New/AddTasks";
import Edit_task from "./components/Admin_Panel/Table/EditTask";
import All_tasks from "./components/Admin_Panel/Table/AllTasks";

//contexts
import AuthContextProvider from "./context/AuthContext";
//css
import "./App.css";

class App extends Component {
  render() {
    return (
        <AuthContextProvider>
          <BrowserRouter>
            <div>
              <Header />
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/home/comments/:commentId" component={Comments} />

              <Route exact path="/admin-login" component={Login} />
              <Route exact path="/admin_forgot" component={Forgot} />
              <Route path="/admin_panel" component={Admin_Panel} />
              <Route
                path="/admin_panel/comments/:commentId"
                component={Comments}
              />

              <Route path="/all_user/add_user" component={Add_user} />
              <Route path="/all_user" component={All_user} />
              <Route
                path="/all_users/edit_user/:userId"
                component={Edit_user}
              />

              <Route path="/all_tasks/add_task" component={Add_Task} />
              <Route path="/all_tasks" component={All_tasks} />
              <Route
                path="/all_tasks/edit_task/:taskId"
                component={Edit_task}
              />
            </div>
          </BrowserRouter>
        </AuthContextProvider>
    );
  }
}

export default App;
