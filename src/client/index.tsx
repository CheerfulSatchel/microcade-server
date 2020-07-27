import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./app/home/home";
import Tetris from "./app/games/tetris";

function App() {
  return (
    <Router>
      <Route exact path="/home" component={Home} />
      <Route exact path="/tetris" component={Tetris} />
    </Router>
  );
}

render(<App />, document.getElementById("root"));
