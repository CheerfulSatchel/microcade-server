import express from "express";
import path from "path";

import * as http from "http";
import socket from "socket.io";
import ip from "ip";

import { RoomManager, Room } from "./services/RoomManager";

const app = express();
const roomManager: RoomManager = new RoomManager();

const port: number = 3001;

app.use(express.static(path.join(__dirname, "../client")));

console.log(path.join(__dirname, "../client"));

app.get("/api", (req, res) => {
  res.send("Ur mum");
});

// creates a room
app.post("/api/createRoom", (req, res) => {
  console.log("POST");
  roomManager.createNewRoom().then((roomId: string) => {
    res.send({ roomId, websocketURL: getWebsocketURL(roomId) });
  });
});

// deletes a room
app.delete("/api/room/:roomId", (req, res) => {
  res.send({ room: roomManager.deleteRoom });
});

// lists all rooms
app.get("/api/rooms/list", (req, res) => {
  const allRooms: Record<string, Room> = roomManager.getAllRooms();

  res.send({ allRooms });
});

// get a specific room
app.get("/api/room/:roomId", (req, res) => {
  res.send({ room: req.params.roomId });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const server: http.Server = http.createServer(app);
const io: socket.Server = socket(server);

io.on("connection", (socket: socket.Socket) => {
  console.log("AYYY MACARENA");
});

server.listen(port, "127.0.0.1", () => {
  return console.log(`server is listening on ${port}`);
});

function getWebsocketURL(roomId: string) {
  return `ws://${ip.address()}:3001/room/${roomId}`;
}
