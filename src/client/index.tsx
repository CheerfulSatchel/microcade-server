import * as React from "react";
import { render } from "react-dom";

import Tetris from "./app/games/tetris";

import "./index.scss";

const App: React.FC = () => (
  <div>
    <Tetris />
  </div>
);

render(<App />, document.getElementById("root"));
