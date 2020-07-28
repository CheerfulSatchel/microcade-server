import server from "./ThyWebSocketServer";

const port: number = 3001;

server.listen(port, "127.0.0.1", () => {
  return console.log(`server is listening on ${port}`);
});
