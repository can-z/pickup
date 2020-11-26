// @flow
import React, { useState } from "react";
import Datetime from "react-datetime";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import "react-datetime/css/react-datetime.css";

const PickupDetail: () => React$Node = () => {
  const fromTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupFromTime",
  };
  const toTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupToTime",
  };

  const customers: Array<string> = ["Roger", "Rogers", "Ray", "Wei"];
  let [customerFieldValue, setCustomerFieldValue] = useState("");
  let [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue, method }) => {
    setCustomerFieldValue(newValue);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : customers.filter(
          (cus) => cus.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const inputProps = {
    placeholder: "Type a customer name or phone number",
    value: customerFieldValue,
    onChange,
    className: "form-control",
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
          <label htmlFor="pickupLocation">Location</label>
          <input
            className="form-control"
            id="pickupLocation"
            placeholder="Enter address"
          />
        </div>
      </div>
      <div className="container-fluid m-1">
        <div className="form-group">
          <div>
            <label htmlFor="customerList" className="m-1">
              Customers
            </label>
          </div>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) => {
              setSuggestions(getSuggestions(value));
            }}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(customer) => customer}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>
    </div>
  );
};

export default PickupDetail;
