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
    const { target } = e;
    const parent = "parentNode"
    if (this.refs.emojis) {
      if (target.id === "icon") return;
      if (
        target &&
        target[parent] &&
        target[parent][parent] &&
        target[parent][parent][parent] &&
        target[parent][parent][parent][parent]
      ) {
        if (
          target[parent].classList.contains("emojiBox") ||
          target[parent][parent].classList.contains("emojiBox") ||
          target[parent][parent][parent].classList.contains("emojiBox") ||
          target[parent][parent][parent][parent].classList.contains("emojiBox")||
          target[parent][parent][parent][parent][parent].classList.contains("emojiBox")
        )
          return;
        if (
          target.classList.contains("jodit_wysiwyg") ||
          target[parent].classList.contains("jodit_wysiwyg") ||
          target[parent][parent].classList.contains("jodit_wysiwyg") ||
          target[parent][parent][parent].classList.contains("jodit_wysiwyg")
        )
          return;
      }
      if (target.classList.contains("textarea")) return;
      if(target.classList.contains("emoji-icon")) return;
      this.refs.emojis.classList.remove("block");
    }
  };
  showEmojis = (emojis) => {
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
        style={{ position: `absolute`, top: `70%`, left: `100%`, zIndex: 10 }}
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
