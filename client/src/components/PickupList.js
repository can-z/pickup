// @flow

import "./PickupList.css";

import React, { useState } from "react";

import AppointmentData from "./AppointmentTable.js";
import Autosuggest from "react-autosuggest";
import FETCH_CUSTOMERS from "./fetchCustomers";
import type { Node } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

const PickupListPage: () => Node = () => {
  let history = useHistory();

  const goToAddAppointmentPage = () => {
    history.push("/add-appointment");
  };

  const goToManageCustomersPage: () => void = () => {
    history.push("/customer-list");
  };

  // Please help me review #27 - 36

  const CustomerData = () => {
    const { loading, error, data } = useQuery(FETCH_CUSTOMERS);
    if (loading) return ["Loading"];
    if (error) return ["Error"];
    return data.customers.map(({ friendlyName }) => friendlyName);
  };

  let [unselectedCustomers, setUnselectedCustomers] = useState(
    <CustomerData />
  );

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
      <div className="container-fluid m-1">
        <button
          type="button"
          onClick={goToAddAppointmentPage}
          className="btn btn-primary mx-1"
        >
          New Pickup Option
        </button>
        <button
          type="button"
          onClick={goToManageCustomersPage}
          className="btn btn-secondary mx-1"
        >
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
      <div className="container-fluid m-1">
        <AppointmentData />
      </div>
      <div className="container-fluid m-1">
        <button
          type="button"
          onClick={goToAddAppointmentPage}
          className="btn btn-secondary mx-1"
        >
          Finalize and notify
        </button>
      </div>
    </div>
  );
};

export default PickupListPage;
