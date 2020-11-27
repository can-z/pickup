// @flow
import React, { useState } from "react";

import Autosuggest from "react-autosuggest";
import { useHistory } from "react-router-dom";

const PickupListPage: () => React$Node = () => {
  let history = useHistory();

  const goToDetailsPage: (batchId: string) => void = (batchId) => {
    history.push("/add-pickup");
  };
  let [unselectedCustomers, setUnselectedCustomers] = useState([
    "Roger",
    "Rogers",
    "Ray",
    "Wei",
    "Wei2",
    "Wei3",
    "Wei5",
    "Wei6",
    "Wei7",
  ]);
  let [customerFieldValue, setCustomerFieldValue] = useState("");
  let [suggestions, setSuggestions] = useState([]);
  let [selectedCustomers, setSelectedCustomers] = useState([]);
  const onChange = (event, { newValue, method }) => {
    setCustomerFieldValue(newValue);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return unselectedCustomers.filter(
      (cus) => cus.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    setSelectedCustomers(selectedCustomers.concat([suggestion]));
    setUnselectedCustomers(
      unselectedCustomers.filter((item) => item !== suggestion)
    );
    setCustomerFieldValue("");
  };
  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const shouldRenderSuggestions = (value, reason) => {
    return true;
  };
  const inputProps = {
    placeholder: "Search to add customer",
    value: customerFieldValue,
    onChange,
    className: "form-control",
  };

  const SelectedCustomerList: ({
    selectedCustomers: Array<string>,
  }) => React$Node = ({ selectedCustomers }) => {
    const listElements = selectedCustomers.map((cust) => (
      <button
        className="btn btn-secondary m-1"
        key={cust}
        onClick={(e) => {
          setUnselectedCustomers(unselectedCustomers.concat([cust]));
          setSelectedCustomers(
            selectedCustomers.filter((item) => item !== cust)
          );
        }}
      >
        {cust}
      </button>
    ));
    return <div>{listElements}</div>;
  };
  return (
    <div>
      <div class="container-fluid m-1">
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          New pickup option
        </a>
        <button type="button" className="btn btn-secondary mx-1">
          Manage customers
        </button>
      </div>
      <div className="container-fluid m-1">
        <div className="form-group">
          <div>
            <label htmlFor="customerList">Customers</label>
          </div>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) => {
              setSuggestions(getSuggestions(value));
            }}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(customer) => customer}
            renderSuggestion={renderSuggestion}
            shouldRenderSuggestions={shouldRenderSuggestions}
            focusInputOnSuggestionClick={false}
            inputProps={inputProps}
          />
        </div>
      </div>
      <div className="container-fluid m-1">
        <label>Selected customers</label>
        <SelectedCustomerList selectedCustomers={selectedCustomers} />
      </div>
      <div class="container-fluid m-1">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Location</th>
              <th scope="col">Confirmed customers</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={goToDetailsPage}>
              <td>11-29 1PM - 1:30PM</td>
              <td>4 Mallingham Crt, North York, ON</td>
              <td>Wei</td>
            </tr>
            <tr onClick={goToDetailsPage}>
              <td>11-29 2PM - 3:30PM</td>
              <td>First Markham Place</td>
              <td></td>
            </tr>
            <tr onClick={goToDetailsPage}>
              <td>12-15 1PM - 1:30PM</td>
              <td>Pacific Mall</td>
              <td>Roger</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="container-fluid m-1">
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          Finalize and notify
        </a>
      </div>
    </div>
  );
};

export default PickupListPage;
