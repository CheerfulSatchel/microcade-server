import React, { useState, useEffect } from "react";
import styled from "styled-components";

declare namespace TetrisMainPage {
  interface Props {
    userName: string;
  }

  interface Room {
    name: string;
    created: string;
    users: string[];
    chatHistory: string[];
  }

  interface IndexedRoomlist {
    [key: string]: Room;
  }
}

const CreateRoomButton = styled.button``;

const RoomsList = styled.ul``;

const JoinRoomTextbox = styled.input``;

const Content = styled.div``;

const Room = styled.li`
  list-style: none;
  background-color: #f9f9f9;
  border-bottom: 1px #151515 solid;
  width: 600px;
  margin-bottom: 0;
  padding: 16px;
  color: #151515;

  & p {
    margin-bottom: 0;
  }
`;

const RoomName = styled.h4`
  font-size: 18px;
  margin-top: 0;
`;

const RoomCreated = styled.p``;

const TetrisMainPage: React.FC<TetrisMainPage.Props> = ({ userName }) => {
  const [roomsList, setRoomsList] = useState<TetrisMainPage.IndexedRoomlist>({});

  const fetchRooms = () =>
    fetch("/api/rooms/list")
      .then((res) => res.json())
      .then(({ allRooms }) => setRoomsList(allRooms));

  const createRoom = () => fetch("/api/createRoom", { method: "POST" }).then(fetchRooms);

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <h2>Hello {userName}</h2>
      <Content>
        <div>
          <CreateRoomButton onClick={createRoom}>Create a room</CreateRoomButton>
        </div>
        <div>
          <p>Join a room</p>
          <JoinRoomTextbox type="text" placeholder="Room name" />
        </div>
        <RoomsList>
          <h3>Available Rooms</h3>
          {Object.keys(roomsList).map((roomKey) => {
            const room = roomsList[roomKey];
            const createdDate = new Date(room.created);

            return (
              <Room key={room.name}>
                <RoomName>{room.name}</RoomName>
                <RoomCreated>
                  Created: {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
                </RoomCreated>
                <p>Users: {room.users?.length}</p>
              </Room>
            );
          })}
        </RoomsList>
      </Content>
    </div>
  );
};

export default TetrisMainPage;
