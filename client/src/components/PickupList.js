// @flow
import React from "react";
import { useHistory } from "react-router-dom";
import TimePicker from "react-time-picker";

const PickupListPage: () => React$Node = () => {
  let history = useHistory();

  const goToDetailsPage: (batchId: string) => void = (batchId) => {
    history.push("/getting-started");
  };
  return (
    <div>
      <div class="container-fluid m-1">
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          New pickup
        </a>
        <button type="button" className="btn btn-secondary mx-1">
          Manage customers
        </button>
      </div>
      <div class="container-fluid m-1">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={goToDetailsPage}>
              <td>11-29 1PM - 1:30PM</td>
              <td>4 Mallingham Crt, North York, ON</td>
            </tr>
            <tr onClick={goToDetailsPage}>
              <td>11-29 2PM - 3:30PM</td>
              <td>First Markham Place</td>
            </tr>
            <tr onClick={goToDetailsPage}>
              <td>12-15 1PM - 1:30PM</td>
              <td>Pacific Mall</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupListPage;
