import express from "express";
import path from "path";

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "../out/client")));

console.log(path.join(__dirname, "../out/client"));

app.get("/api", (req, res) => {
  res.send("Ur mufm");
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
