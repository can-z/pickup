// @flow

import "./PickupList.css";

import AppointmentData from "./AppointmentTable.js";
import AutosuggestComponent from "./Autosuggest";
import { FETCH_CUSTOMERS } from "./fetchCustomers";
import type { Node } from "react";
import React from "react";
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

  const CustomerData = () => {
    const { loading, error, data } = useQuery(FETCH_CUSTOMERS);

    if (loading) return <p>Please wait for a moment...</p>;
    if (error) return <p>There is something wrong...</p>;
    return (
      <AutosuggestComponent names={data.customers.map((x) => x.friendlyName)} />
    );
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
        <CustomerData />
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
