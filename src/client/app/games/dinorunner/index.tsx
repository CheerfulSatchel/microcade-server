import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Runner from "./components/runner";
import MainPage from "./main/mainPage";

const DinoRunner: React.FC = () => (
  <BrowserRouter basename="dinorunner">
    <Route exact path="/" component={MainPage} />
    <Route exact path="/game/:roomName" component={Runner} />
  </BrowserRouter>
);

export default DinoRunner;
