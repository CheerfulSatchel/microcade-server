import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import MainPage from "./main/mainPage";
import Tetris from "./tetris";

declare namespace TetrisHome {
  interface Props {
    userName: string;
  }
}

const TetrisHome: React.FC<TetrisHome.Props> = ({ userName }) => {
  return (
    <BrowserRouter basename="tetris">
      <Route exact path="/" component={() => <MainPage userName={userName} />} />
      <Route exact path="/game/:roomName" render={(props) => <Tetris {...props} userName={userName} />} />
    </BrowserRouter>
  );
};

export default TetrisHome;
