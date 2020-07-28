import * as http from "http";
import socket from "socket.io";
import ThyExpressServer from "./ThyExpressServer";

const server: http.Server = http.createServer();

server.on("request", ThyExpressServer);

const webSocketServer = socket(server);
webSocketServer.on("connection", (socket) => {
  console.log("CONNECTED TO THE LORD");
});

export default server;
