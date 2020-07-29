import React, { useState, useEffect } from "react";
import { Events } from "../../../server/Constants";
import styled from "styled-components";

interface Props {
  connectedWebsocket: SocketIOClient.Socket;
  roomName: string;
  userName: string;
  initialMessages: string[];
}

interface State {
  currentMessage: string;
  messages: string[];
}

const SubmitButton = styled.button`
  box-sizing: border-box;
  margin: 0 0 5px 0;
  padding: 20px;
  min-height: 30px;
  border-radius: 20px;
  border: none;
  color: white;
  background: #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

export class ChatComponent extends React.Component<Props, State> {
  public textArea: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.state = {
      currentMessage: "",
      messages: props.initialMessages,
    };

    this.props.connectedWebsocket.on(Events.MESSAGE, (messages: string[]) => {
      this.setState({ messages: messages });
    });

    this.handleMessageChanged = this.handleMessageChanged.bind(this);
    this.submitButtonPressed = this.submitButtonPressed.bind(this);

    this.textArea = React.createRef();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.initialMessages.length !== this.props.initialMessages.length) {
      this.setState({
        messages: this.props.initialMessages,
      });
    }

    this.textArea.current.scrollTop = this.textArea.current.scrollHeight;
  }

  handleMessageChanged(event) {
    event.preventDefault();
    this.setState({ currentMessage: event.target.value });
  }

  submitButtonPressed(event) {
    event.preventDefault();
    console.log(`MESSAGE: ${this.state.currentMessage}`);
    this.props.connectedWebsocket.emit(
      Events.MESSAGE,
      this.props.roomName,
      this.props.userName,
      this.state.currentMessage
    );
    this.setState({ currentMessage: "" });
  }

  render() {
    return (
      <div>
        <textarea
          rows={20}
          cols={50}
          disabled={true}
          value={this.state.messages.join("\r\n")}
          ref={this.textArea}
        ></textarea>
        <form>
          <label>Say something~</label>
          <input type="text" value={this.state.currentMessage} onChange={this.handleMessageChanged} />
          <SubmitButton
            className="Submit"
            type="submit"
            value="Submit"
            onClick={this.submitButtonPressed}
            onKeyUp={this.submitButtonPressed}
          >
            send
          </SubmitButton>
        </form>
      </div>
    );
  }
}

export default ChatComponent;
