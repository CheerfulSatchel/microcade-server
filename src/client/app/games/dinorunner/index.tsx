import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Runner from "./components/runner";
import MainPage from "./main/mainPage";

const DinoRunner: React.FC = () => (
  <>
    <Route exact path="/dinorunner" component={MainPage} />
    <Route exact path="/dinorunner/game/:roomName" component={Runner} />
  </>
);

export default DinoRunner;
