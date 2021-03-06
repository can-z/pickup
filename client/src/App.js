// @flow

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import CreateOrUpdateAppointment from "./components/CreateOrUpdateAppointment";
import CustomerCreateForm from "./components/CustomerCreateForm";
import CustomerList from "./components/CustomerList";
import PickupListPage from "./components/PickupList";
import React from "react";

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
        <Route exact path="/add-appointment">
          <CreateOrUpdateAppointment />
        </Route>
        <Route exact path="/customer-list">
          <CustomerList />
        </Route>
        <Route path="/create-a-customer">
          <CustomerCreateForm />
        </Route>
        <Route
          path="/appointment/:userId"
          exact
          component={CreateOrUpdateAppointment}
        ></Route>
      </Switch>
    </Router>
  );
};

const StartingPoint: () => React$Node = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src="" className="App-logo" alt="logo" />
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
