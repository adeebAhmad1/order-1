import React, { Component, createContext } from 'react';

import firebase from '../config/firebase'

export const AuthContext = createContext();

export default class AuthContextProvider extends Component {

    state = {
        isAuthenticated: false,
        user: {}
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                console.log( "User is logged in" )
                this.setState({isAuthenticated: true, user: user})
            } else {
                // User is signed out.
                // ...
                console.log( "User is logged out" )
                this.setState({isAuthenticated: false, user: {}})
            }
        });
    }

    render() {
        return (
            <AuthContext.Provider value={{ ...this.state }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }

}