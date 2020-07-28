// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from "react";
import "./home.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        <div>
          <h1>MicroCade</h1> <h3>TIME TO PLAY TETRIS :-)</h3>
          <Link to="/tetris">
            <div className="card">Tetris</div>
          </Link>
          <div className="card">Drawful</div>
          <div className="card">Uno</div>
          <div className="card">Call of Duty: Black Ops IV</div>
        </div>
      </main>
    );
  }
}
export default Home;
