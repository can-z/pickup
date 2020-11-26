// @flow
import "./AutoSuggest.css";
import "react-datetime/css/react-datetime.css";

import React, { useState } from "react";

import Autosuggest from "react-autosuggest";
import Datetime from "react-datetime";

const PickupDetail: () => React$Node = () => {
  const fromTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupFromTime",
  };
  const toTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupToTime",
  };

  let [unselectedCustomers, setUnselectedCustomers] = useState([
    "Roger",
    "Rogers",
    "Ray",
    "Wei",
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

    return inputLength === 0
      ? []
      : unselectedCustomers.filter(
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
    console.log(`adding ${suggestion}`);
    setSelectedCustomers(selectedCustomers.concat([suggestion]));
    setUnselectedCustomers(
      unselectedCustomers.filter((item) => item !== suggestion)
    );
    setCustomerFieldValue("");
  };
  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const inputProps = {
    placeholder: "Search to add customer",
    value: customerFieldValue,
    onChange,
    className: "form-control",
  };

  const SelectedCustomerList: ({
    selectedCustomers: Array<string>,
  }) => React$Node = ({ selectedCustomers }) => {
    const listElements = selectedCustomers.map((cust) => <li>{cust}</li>);
    return <ul>{listElements}</ul>;
  };
  return (
    <div>
      <div className="container-fluid m-1">
        <label htmlFor="pickupFromTime">Start time</label>
        <Datetime inputProps={fromTimeInputProps} />
      </div>
      <div className="container-fluid m-1">
        <label htmlFor="pickupToTime">End time</label>
        <Datetime inputProps={toTimeInputProps} />
      </div>
      <div className="container-fluid m-1">
        <div className="form-group">
          <label htmlFor="pickupLocation">Address</label>
          <input
            className="form-control"
            id="pickupLocation"
            placeholder="Enter address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickupDetails">Pickup details (Optional)</label>
          <input
            className="form-control"
            id="pickupDetails"
            placeholder="Further instructions on the pickup location"
          />
        </div>
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
            inputProps={inputProps}
          />
        </div>
      </div>
      <div className="container-fluid m-1">
        <label>Selected customers</label>
        <SelectedCustomerList selectedCustomers={selectedCustomers} />
      </div>
    </div>
  );
};

export default PickupDetail;
