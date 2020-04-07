import React, { Component } from "react";
import { DataContext } from "../../context/DataContext";
class EmojiBox extends Component {
  static contextType = DataContext;
  showGroups = () => {
    const groups = Object.keys(this.context.emojis);
    const emojis = Object.values(this.context.emojis);
    groups.pop();
    emojis.pop();
    return groups.map((group, i) => {
      return (
        <div key={i} style={{ width: `100%`, textAlign: `justify` }}>
          <h1
            style={{
              fontSize: `24px`,
              margin: `10px auto`,
              textAlign: `center`,
              fontWeight: `900`,
            }}
          >
            {" "}
            {group}{" "}
          </h1>
          {this.showEmojis(emojis[i])}
        </div>
      );
    });
  };
  componentDidMount() {
    window.addEventListener("click", this.handleClick);
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }
  handleClick = (e) => {
    if (this.refs.emojis) {
      if (e.target.id === "icon") return;
      if (
        e.target &&
        e.target.parentNode &&
        e.target.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode &&
        e.target.parentNode.parentNode.parentNode.parentNode
      ) {
        if (
          e.target.parentNode.classList.contains("emojiBox") ||
          e.target.parentNode.parentNode.classList.contains("emojiBox") ||
          e.target.parentNode.parentNode.parentNode.classList.contains(
            "emojiBox"
          ) ||
          e.target.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emojiBox"
          )||
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(
            "emojiBox"
          )
        )
          return;
        if (
          e.target.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.parentNode.classList.contains("jodit_wysiwyg") ||
          e.target.parentNode.parentNode.parentNode.classList.contains(
            "jodit_wysiwyg"
          )
        )
          return;
      }
      if (e.target.classList.contains("textarea")) return;
      if(e.target.classList.contains("emoji-icon")) return;
      this.refs.emojis.classList.remove("block");
    }
  };
  showEmojis = (emojis) => {
    console.log(emojis)
    if (emojis.length > 500) emojis = emojis.slice(0, 500);
    return emojis.map((emoji) => {
      return (
        <a 
          href="/"
          className="emoji-icon"
          onClick={(e) => this.props.addEmoji(e, emoji.char)}
          key={Math.random()}
        >
          {" "}
          {emoji.char}
        </a>
      );
    });
  };
  showEmojiBox = () => {
    this.refs.emojis.classList.toggle("block");
  };
  render() {
    return (
      <div
        className="noselect"
        style={{ position: `absolute`, top: `50%`, left: `81%`, zIndex: 10 }}
      >
        <i
          className={`far fa-smile left ${this.props.commentsIcon}`}
          id="icon"
          onClick={this.showEmojiBox}
        ></i>
        <div ref="emojis" className="emojiBox">
          {this.showGroups()}
        </div>
      </div>
    );
  }
}

export default EmojiBox;
