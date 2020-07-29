import server from "./ThyWebSocketServer";

const port: number | string = process.env.PORT || 3001;

server.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
