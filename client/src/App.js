// @flow

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const App: () => React$Node = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <BatchListPage />
        </Route>
        <Route exact path="/getting-started">
          <StartingPoint />
        </Route>
      </Switch>
    </Router>
  );
};

const BatchListPage: () => React$Node = () => {
  let history = useHistory();

  const goToDetailsPage: (batchId: string) => void = (batchId) => {
    history.push("/getting-started");
  };
  return (
    <div>
      <button type="button" className="btn btn-primary">
        New pickup
      </button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={goToDetailsPage}>
            <td>11-29 1PM - 1:30PM</td>
            <td>4 Mallingham Crt, North York, ON</td>
          </tr>
          <tr onClick={goToDetailsPage}>
            <td>11-29 2PM - 3:30PM</td>
            <td>First Markham Place</td>
          </tr>
          <tr onClick={goToDetailsPage}>
            <td>12-15 1PM - 1:30PM</td>
            <td>Pacific Mall</td>
          </tr>
        </tbody>
      </table>
    </div>
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
