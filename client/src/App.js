// @flow

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: () => React$Node = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/home">
          <h1>Home</h1>
        </Route>
        <Route exact path="/">
          <StartingPoint />
        </Route>
      </Switch>
    </Router>
  );
};

const StartingPoint: () => React$Node = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export { App, StartingPoint };
