// @flow

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import PickupDetail from "./components/PickupDetail";
import PickupListPage from "./components/PickupList";
import React from "react";
import logo from "./logo.svg";

const App: () => React$Node = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <PickupListPage />
        </Route>
        <Route exact path="/getting-started">
          <StartingPoint />
        </Route>
        <Route exact path="/add-pickup">
          <PickupDetail />
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
