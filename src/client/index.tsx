import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./app/home/home";
import Tetris from "./app/games/tetris";
import DinoRunner from "./app/games/dinorunner";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/home" component={Home} />
      <Route path="/tetris" component={Tetris} />
      <Route path="/dinorunner" component={DinoRunner} />
    </Router>
  );
}

render(<App />, document.getElementById("root"));
