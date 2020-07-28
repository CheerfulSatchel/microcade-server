import express from "express";
import ip from "ip";
import path from "path";

import { RoomManager, Room, RoomDTO } from "./services/RoomManager";

const ThyExpressServer = express();
export const roomManager: RoomManager = new RoomManager();

const port: number = 3001;

ThyExpressServer.use(express.static(path.join(__dirname, "../client")));
ThyExpressServer.use(express.json());

ThyExpressServer.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

ThyExpressServer.get("/api", (req, res) => {
  res.send("Ur mum");
});

// creates a room
ThyExpressServer.post("/api/createRoom", (req, res) => {
  console.log("POST - CREATE ROOM");
  roomManager.createNewRoom().then((roomId: string) => {
    res.send({ roomId });
  });
});

// deletes a room
ThyExpressServer.delete("/api/room/:roomId", (req, res) => {
  res.send({ room: roomManager.deleteRoom });
});

// lists all rooms
ThyExpressServer.get("/api/rooms/list", (req, res) => {
  const allRooms: Record<string, Room> = roomManager.getAllRooms();

  res.send({ allRooms });
});

// get a specific room
ThyExpressServer.get("/api/room/:roomId", (req, res) => {
  const room = roomManager.getRoom(req.params.roomId);

  if (room) {
    const roomDTO: RoomDTO = {
      name: room.name,
      created: room.created,
      users: room.users,
      chatHistory: room.chatHistory,
    };
    res.send(roomDTO);
  } else {
    res.sendStatus(404);
  }
});

// start game for room
ThyExpressServer.post("/api/room/start/:roomId", (req, res) => {
  const successful = roomManager.startGameForRoom(req.params.roomId);

  if (successful) {
    res.sendStatus(200);
  } else {
    res.send("No room by that name").status(400);
  }
});

// mark player finished
ThyExpressServer.post("/api/room/finish/:roomId", (req, res) => {
  const { socketId } = req.body as { socketId: string };
  const successful = roomManager.markPlayerFinished(req.params.roomId, socketId);

  if (successful) {
    res.sendStatus(200);
  } else {
    res.send("Failed to mark player finished").status(400);
  }
});

ThyExpressServer.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

export default ThyExpressServer;
