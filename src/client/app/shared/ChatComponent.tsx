import React, { useState, useEffect } from "react";
import { Events } from "../../../server/Constants";

interface Props {
  connectedWebsocket: SocketIOClient.Socket;
}

interface State {
  currentMessage: string;
  messages: string[];
}

export class ChatComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: "",
      messages: [],
    };

    this.handleMessageChanged = this.handleMessageChanged.bind(this);
    this.submitButtonPressed = this.submitButtonPressed.bind(this);
  }

  handleMessageChanged(event) {
    this.setState({ currentMessage: event.target.value });
  }

  submitButtonPressed() {
    this.props.connectedWebsocket.emit(Events.MESSAGE, this.state.currentMessage);
  }

  render() {
    return (
      <div>
        <textarea rows={20} cols={50}></textarea>
        <form>
          <label>Say something~</label>
          <input type="text" value={this.state.currentMessage} onChange={this.handleMessageChanged} />
          <button type="submit" value="Submit" onClick={this.submitButtonPressed}></button>
        </form>
      </div>
    );
  }
}

export default ChatComponent;
