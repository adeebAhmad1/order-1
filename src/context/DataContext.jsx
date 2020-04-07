import React, { Component, createContext } from "react";
export const DataContext = createContext();
class DataContextProvider extends Component {
  state = {
    emojis: {}
  };
  componentDidMount() {
    fetch("https://unpkg.com/emoji.json@12.1.1/emoji.json").then(el =>
      el.json()
    ).then(allEmojis=>{
      const emojis = {}
      allEmojis.forEach(emoji=>{
        if (emoji.group in emojis) {
          emojis[emoji.group].push(emoji);
        } else {
          emojis[emoji.group] = new Array(emoji);
        }
      })

      this.setState({emojis})
      return true
    })
  }
  render() {
    return <DataContext.Provider value={this.state}>
      {this.props.children}
    </DataContext.Provider>
    ;
  }
}

export default DataContextProvider;
