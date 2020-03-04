//dependicies
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

//components

import Header from "./components/layout/Header";
import Home from "./components/Home";
import Login from "./components/Login";

import Admin_Panel from "./components/Admin_Panel";
import Add_user from "./components/Admin_Panel/Table/New/Employe";
import All_user from "./components/Admin_Panel/Table/Allusers";


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
            <Route exact path="/home" component={Home} />
            <Route exact path="/" component={Home} />
            <Route exact path="/admin_panel" component={Admin_Panel} /> 
            <Route path="/all_user/add_user" component={Add_user} /> 
            <Route path="/all_user" component={All_user} /> 

            <Route exact path="/admin-login" component={Login} />
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    );
  }
}

export default App;
