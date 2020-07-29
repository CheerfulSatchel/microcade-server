import * as http from "http";
import socket from "socket.io";
import ThyExpressServer from "./ThyExpressServer";
import { roomManager } from "./ThyExpressServer";
import { Events } from "./Constants";

const server: http.Server = http.createServer();

server.on("request", ThyExpressServer);

const webSocketServer = socket(server);
webSocketServer.on(Events.CONNECTION, (socket: socket.Socket) => {
  const userName: string = socket.handshake.query.userName;
  console.log(socket);

  socket.on(Events.CONNECT_TO_ROOM, (roomName) => {
    console.log("Connected: " + userName);
    roomManager.addSocketToRoom(roomName, userName, socket);

    socket.on("disconnect", () => {
      console.log(`Goodbye, ${userName}!`);
      roomManager.removeSocketFromRoom(roomName, userName, socket.id);
      socket.leave(roomName);
    });
  });

  socket.on(Events.MESSAGE, (roomName, message) => {
    console.log(`Received message: ${message}`);
    roomManager.sendChatMessageToRoom(roomName, userName, message);
  });
});

export default server;
