import * as http from "http";
import socket from "socket.io";
import ThyExpressServer from "./ThyExpressServer";
import { roomManager } from "./ThyExpressServer";
import { Events } from "./Constants";

const server: http.Server = http.createServer();

server.on("request", ThyExpressServer);

const webSocketServer = socket(server);
webSocketServer.on(Events.CONNECTION, (socket: socket.Socket) => {
  socket.on(Events.CONNECTTOROOM, (roomName) => {
    roomManager.addSocketToRoom(roomName, socket);
  });

  socket.on(Events.MESSAGE, (message) => {
    console.log(`RECEIVED MESSAGE: ${message}`);
  });
});

export default server;
