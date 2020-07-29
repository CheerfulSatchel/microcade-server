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

  socket.on(Events.CONNECT_TO_ROOM, (roomName) => {
    roomManager.addSocketToRoom(roomName, userName, socket);

    socket.on("disconnect", () => {
      roomManager.removeSocketFromRoom(roomName, userName, socket.id);
      socket.leave(roomName);
    });
  });

  socket.on(Events.MESSAGE, (roomName, message) => {
    roomManager.sendChatMessageToRoom(roomName, userName, message);
  });
});

export default server;
