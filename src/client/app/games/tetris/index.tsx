import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainPage from "./main/mainPage";
import Tetris from "./tetris";
import Home from "../../home/home";

declare namespace TetrisHome {
  interface Props {
    userName: string;
  }
}

const TetrisHome: React.FC<TetrisHome.Props> = ({ userName }) => {
  return (
    <>
      <Route exact path="/tetris" component={() => <MainPage userName={userName} />} />
      <Route exact path="/tetris/game/:roomName" component={Tetris} />
    </>
  );
};

export default TetrisHome;
