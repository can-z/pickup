import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { useHistory } from "react-router-dom";

const CUSTOMER_CREATE = gql`
  mutation CreateCustomer($friendlyName: String!, $phoneNumber: String!) {
    createCustomer(friendlyName: $friendlyName, phoneNumber: $phoneNumber) {
      id
      friendlyName
      phoneNumber
    }
  }
`;

const CustomerCreateForm = () => {
  const history = useHistory();
  const backToCustomerList = () => {
    history.push("/customer-list");
  };

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerNumber, setNewCustomerNumber] = useState("");

  const [createCustomer] = useMutation(CUSTOMER_CREATE, {
    onCompleted: () => {
      backToCustomerList();
    },
  });

  const handleSubmit = () => {
    return createCustomer({
      variables: {
        friendlyName: newCustomerName,
        phoneNumber: newCustomerNumber,
      },
    });
  };

  return (
    <div className="container-fluid m-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder=""
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phonenumber"
            placeholder=""
            value={newCustomerNumber}
            onChange={(e) => setNewCustomerNumber(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary mx-1">
          {" "}
          Submit{" "}
        </button>
      </form>

      <div className="container-fluid m-1">
        <button
          type="button"
          onClick={backToCustomerList}
          className="btn btn-secondary mx-1"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CustomerCreateForm;
