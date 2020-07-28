import React from "react";
import styled from "styled-components";

declare namespace TetrisMainPage {
  interface Props {
    userName: string;
  }
}

const CreateRoomButton = styled.button``;

const RoomsList = styled.div``;

const JoinRoomTextbox = styled.input``;

const TetrisMainPage: React.FC<TetrisMainPage.Props> = ({ userName }) => {
  console.log("Main");
  return (
    <div>
      <h2>Hello {userName}</h2>
      <CreateRoomButton />
      <RoomsList />
      <JoinRoomTextbox type="text" />
    </div>
  );
};

export default TetrisMainPage;
