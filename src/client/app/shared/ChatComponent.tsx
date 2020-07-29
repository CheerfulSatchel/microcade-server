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

const ChatContainer = styled.textarea`
  border-radius: 20px;
  resize: none;
  padding: 8px;
`;

const SubmitButton = styled.button`
  box-sizing: border-box;

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
    this.props.connectedWebsocket.emit(Events.MESSAGE, this.props.roomName, this.state.currentMessage);
    this.setState({ currentMessage: "" });
  }

  render() {
    return (
      <div>
        <ChatContainer
          style={{
            backgroundColor: "white",
            color: "black",
          }}
          rows={20}
          cols={50}
          disabled={true}
          value={this.state.messages.join("\r\n")}
          ref={this.textArea}
        ></ChatContainer>
        <div>
          <form>
            <SubmitButton
              className="Submit"
              type="submit"
              value="Submit"
              style={{
                float: "right",
              }}
              onClick={this.submitButtonPressed}
              onKeyUp={this.submitButtonPressed}
            >
              send
            </SubmitButton>
            <span
              style={{
                display: "block",
                overflow: "hidden",
                paddingRight: "10px",
              }}
            >
              <input
                type="text"
                style={{ width: "100%", borderRadius: "10px", padding: 4 }}
                value={this.state.currentMessage}
                onChange={this.handleMessageChanged}
              />
            </span>
          </form>
        </div>
      </div>
    );
  }
}

export default ChatComponent;
