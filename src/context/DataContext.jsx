import React, { Component,createContext } from 'react';
import { db } from '../config/firebase';

export const DataContext = createContext();
class DataContextProvider extends Component {
  state={
    todos: [],
    users: [],
    comments: [],
    tasks: [],
    isLoading: true
  }
  componentDidMount(){
    db.collection("users").onSnapshot(querySnapshot=>{
      const elements = []
      querySnapshot.forEach(doc=>{
        const el = doc.data();
        el.id = doc.id;
        elements.push(el);
      });
      this.setState({users: elements});
      db.collection("tasks").onSnapshot(querySnapshot=>{
        const elements = []
        querySnapshot.forEach(doc=>{
          const el = doc.data();
          el.id = doc.id;
          elements.push(el);
        });
        this.setState({tasks: elements});
        db.collection("todos").onSnapshot(querySnapshot=>{
          const elements = [];
          querySnapshot.forEach(doc=>{
            const el = doc.data();
            el.id = doc.id;
            elements.push(el);
          });
          this.setState({todos: elements});
          db.collection("comments").onSnapshot(querySnapshot=>{
            const elements = []
            querySnapshot.forEach(doc=>{
              const el = doc.data();
              el.id = doc.id;
              elements.push(el);
            });
            this.setState({comments: elements,isLoading: false});
          });
        });
      });
    });
  }
  render () {
    return (
      <DataContext.Provider value={this.state}>
        {this.props.children}
      </DataContext.Provider>
    )
  }
}

export default DataContextProvider;