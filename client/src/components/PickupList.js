// @flow

import "./PickupList.css";

import React, { useState } from "react";
import { gql, useQuery } from '@apollo/client';

import Autosuggest from "react-autosuggest";
import type { Node } from "react";
import { useHistory } from "react-router-dom";

const FETCH_APPOINTMENTS = gql`
  query {
    appointments{
      id
      startTime
      endTime
      location {
        id
        address
      }
    }
  }
`;

const PickupListPage: () => Node = () => {
  let history = useHistory();

  const goToDetailsPage: (batchId: string) => void = (batchId: string) => {
    history.push("/add-pickup");
  };

  const goToManageCustomersPage: () => void = () => {
    history.push("/customer-list");
  };

  const AppointmentData = () => {
    const {loading, error, data} = useQuery(FETCH_APPOINTMENTS);
    
    if(loading) return <tr><td>Loading...</td></tr>;
    if(error) return <tr><td>Loading...</td></tr>;

    return data.appointments.map( ({id, startTime, endTime, location}) => (
        <tr key={id}>
            <td>{startTime} - {endTime}</td>
            <td>{location.address}</td>
            <td></td>
        </tr>
    ));    
  }

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
      <div className="container-fluid m-1">
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          New pickup option
        </a>
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
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Location</th>
              <th scope="col">Confirmed customers</th>
            </tr>
          </thead>
          <tbody>
            {AppointmentData()} 
          </tbody>
        </table>
      </div>
      <div className="container-fluid m-1">
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          Finalize and notify
        </a>
      </div>
    </div>
  );
};

export default PickupListPage;
