import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

declare namespace TetrisMainPage {
  interface Props {
    userName: string;
  }

  interface Room {
    name: string;
    created: string;
    users: string[];
    chatMessages: string[];
  }

  interface IndexedRoomlist {
    [key: string]: Room;
  }
}

const CreateRoomButton = styled.button``;

const RoomsList = styled.div``;

const JoinRoomTextbox = styled.input`
  border-radius: 8px;
  height: 25px;
  font-size: 15px;
`;

const Content = styled.div``;

const Room = styled.div`
  list-style: none;
  background-color: #f9f9f9;
  border-bottom: 1px #151515 solid;
  margin-bottom: 0;
  padding: 16px;
  color: #151515;
  border-radius: 10px;
  margin-bottom: 5px;

  & p {
    margin-bottom: 0;
  }
`;

const RoomName = styled.div`
  font-size: 18px;
  margin-top: 0;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
`;

const Heading = styled.h1`
  color: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid white;
  display: flex;
  line-height: 60px;
  font-size: 25px;
`;

const Container = styled.div`
  padding: 0px 50px 0 50px;
`;
const RoomCreated = styled.p``;

const TetrisMainPage: React.FC<TetrisMainPage.Props> = ({ userName }) => {
  const history = useHistory();
  const [roomsList, setRoomsList] = useState<TetrisMainPage.IndexedRoomlist>({});

  const fetchRooms = () =>
    fetch("/api/rooms/list/tetris")
      .then((res) => res.json())
      .then(({ allRooms }) => setRoomsList(allRooms));

  const createRoom = () => fetch("/api/createRoom/tetris", { method: "POST" }).then(fetchRooms);

  const openRoom = (roomName: string) => {
    history.push(`/game/${roomName}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Container>
      <Heading>
        <img
          className="microcade-title"
          src={require("../../../../../resources/images/microcade.png")}
          alt="Microcade logo"
          height="60px"
        ></img>
        <div className="sub-heading">Welcome to Tetris, {userName}!</div>
      </Heading>
      <Content>
        <div style={{ display: "flow-root", paddingBottom: "15px", lineHeight: "26px" }}>
          <span className="h2-bold">Available Rooms</span>
          <div style={{ float: "right" }}>
            <button className="button mar-right" onClick={createRoom}>
              Create a room
            </button>
            <span className="join-message">Join a room:</span>
            <JoinRoomTextbox type="text" placeholder="Room name" />
          </div>
        </div>
        <RoomsList>
          {Object.keys(roomsList).map((roomKey) => {
            const room = roomsList[roomKey];
            const createdDate = new Date(room.created);

            return (
              <Room key={room.name} onClick={() => openRoom(room.name)}>
                <RoomName>{room.name}</RoomName>
                <div>Users: {room.users?.length}</div>
                <RoomCreated>
                  Created: {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
                </RoomCreated>
              </Room>
            );
          })}
        </RoomsList>
      </Content>
    </Container>
  );
};

export default TetrisMainPage;
