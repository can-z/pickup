import React, { useState } from "react";

import Autosuggest from "react-autosuggest";
import type { Node } from "react";

const AutoSuggestComponent: () => Node = (props) => {
  let [unselectedCustomers, setUnselectedCustomers] = useState(props.names);

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
      <div className="container-fluid m-1">
        <label>Selected customers</label>
        <SelectedCustomerList selectedCustomers={selectedCustomers} />
      </div>
    </div>
  );
};

export default AutoSuggestComponent;
