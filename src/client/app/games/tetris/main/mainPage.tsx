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
      <CreateRoomButton onClick={createRoom}>Create a room</CreateRoomButton>
      <RoomsList>
        {Object.keys(roomsList).map((roomKey) => {
          const room = roomsList[roomKey];

          return (
            <li key={room.name}>
              <p>{room.name}</p>
              <p>{new Date(room.created).toLocaleDateString()}</p>
              <p>Users: {room.users?.length}</p>
            </li>
          );
        })}
      </RoomsList>
      <JoinRoomTextbox type="text" />
    </div>
  );
};

export default TetrisMainPage;
