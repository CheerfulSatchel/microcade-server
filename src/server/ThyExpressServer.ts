import express from "express";
import ip from "ip";
import path from "path";

import { RoomManager, Room } from "./services/RoomManager";

const ThyExpressServer = express();
const roomManager: RoomManager = new RoomManager();

const port: number = 3001;

ThyExpressServer.use(express.static(path.join(__dirname, "../client")));

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
    res.send({ roomId, websocketURL: getWebsocketURL(roomId) });
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
  res.send({ room: req.params.roomId });
});

ThyExpressServer.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

function getWebsocketURL(roomId: string) {
  return `ws://${ip.address()}:3001/room/${roomId}`;
}

export default ThyExpressServer;
