import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainPage from "./main/mainPage";
import Tetris from "./tetris";

const TetrisHome: React.FC<{}> = () => {
  return (
    <>
      <Route exact path="/tetris" component={() => <MainPage />} />
      <Route exact path="/tetris/game/:roomName" component={Tetris} />
    </>
  );
};

export default TetrisHome;
