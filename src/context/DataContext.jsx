import React, { Component,createContext } from 'react';
import { db } from '../config/firebase';

export const DataContext = createContext();
class DataContextProvider extends Component {
  state={
    todos: [],
    users: [],
    comments: [],
    tasks: []
  }
  componentDidMount(){
    this.getFromDB("todos");
    this.getFromDB("users");
    this.getFromDB("comments");
    this.getFromDB("tesks");
  }
  getFromDB = (value)=>{
    db.collection(value).get().then(querySnapshot=>{
      const elements = []
      querySnapshot.forEach(doc=>{
        const el = doc.data();
        el.id = doc.id;
        elements.push(el);
      })
      this.setState({[value]: elements});
    })
  }
  render () {
    return (
      <DataContext.Provider>
        {this.props.children}
      </DataContext.Provider>
    )
  }
}

export default DataContextProvider;