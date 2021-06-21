import { gql, useMutation, useQuery } from "@apollo/client";

import { FETCH_CUSTOMERS } from "./fetchCustomers";
import React from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useHistory } from "react-router-dom";

const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`;

const CustomerList = () => {
  const history = useHistory();
  const backToLanding = () => {
    history.push("/");
  };

  const CreateCustomer = () => {
    history.push("/create-a-customer");
  };

  const CustomerData = () => {
    const { loading, error, data, refetch } = useQuery(FETCH_CUSTOMERS,{
      fetchPolicy: "no-cache"
    });

    const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
      onCompleted: () => refetch(),
    });
    if (loading)
      return (
        <tr>
          <td>Loading...</td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td>Loading...</td>
        </tr>
      );

    return data.customers.map(({ id, friendlyName, phoneNumber }) => (
      <tr key={id}>
        <td>{id}</td>
        <td>{friendlyName}</td>
        <td>{phoneNumber}</td>
        <td>
          <button
            type="button"
            className="btn btn-light mx-1"
            onClick={() => deleteCustomer({ variables: { id: id } })}
          >
            <RiDeleteBin2Line size={32} />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="container-fluid m-1">
        <button
          type="button"
          className="btn btn-primary mx-1"
          onClick={CreateCustomer}
        >
          New Customer
        </button>
        <button
          type="button"
          onClick={backToLanding}
          className="btn btn-secondary mx-1"
        >
          Back
        </button>
      </div>

      <div className="container-fluid m-1">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">id</th>
              <th scope="col">Name</th>
              <th scope="col">Number</th>
              <th scope="col">Modify</th>
            </tr>
          </thead>
          <tbody>
            <CustomerData />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
