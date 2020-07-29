// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from "react";
import "../app.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const userName = window.location.search && window.location.search.split("=")[1].split("&")[0];
    // Forgive me
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.setItem("userName", "Unnamed Weirdo");
    }
  }

  render() {
    return (
      <main>
        <h1>
          <img src={require("../../../resources/images/microcade.png")} alt="Microcade logo" height="75px"></img>
        </h1>
        <div className="game-container">
          <div className="child">
            <Link to="/tetris">
              <img className="card" src={require("../../../resources/images/tetris.png")} alt="Tetris image"></img>
            </Link>
            <img className="card" src={require("../../../resources/images/drawful.png")} alt="Drawful image"></img>
          </div>
          <div className="child">
            <img className="card" src={require("../../../resources/images/uno.png")} alt="Uno image"></img>
            <Link to="/dinorunner">
              <img className="card" src={require("../../../resources/images/dinorun.png")} alt="Dino Run image"></img>
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
export default Home;
