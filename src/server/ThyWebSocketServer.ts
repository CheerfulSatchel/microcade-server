import * as http from "http";
import socket from "socket.io";
import ThyExpressServer from "./ThyExpressServer";
import { roomManager } from "./ThyExpressServer";
import { Events } from "./Constants";

const server: http.Server = http.createServer();

server.on("request", ThyExpressServer);

const webSocketServer = socket(server);
webSocketServer.on(Events.CONNECTION, (socket: socket.Socket) => {
  socket.on(Events.CONNECT_TO_ROOM, (roomName, userName) => {
    roomManager.addSocketToRoom(roomName, userName, socket);

    socket.on("disconnect", () => {
      console.log("YOOOO");
      roomManager.removeSocketFromRoom(roomName, socket.id);
      socket.leave(roomName);
    });
  });

  socket.on(Events.MESSAGE, (roomName, userName, message) => {
    console.log(`RECEIVED MESSAGE: ${message}`);
    roomManager.sendChatMessageToRoom(roomName, userName, message);
  });
});

export default server;
