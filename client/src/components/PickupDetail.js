// @flow

import "react-datetime/css/react-datetime.css";

import Datetime from "react-datetime";
import React from "react";
import { useHistory } from "react-router-dom";

const PickupDetail: () => React$Node = () => {
  const fromTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupFromTime",
  };
  const toTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupToTime",
  };

  const history = useHistory();
  const backToLanding = () => {
    history.push("/");
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
      <div class="container-fluid m-1">
        <button type="button" onClick={backToLanding} className="btn btn-primary mx-1">
          Save draft
        </button>
        <button type="button" onClick={backToLanding} className="btn btn-secondary mx-1">
          Back
        </button>
      </div>
    </div>
  );
};

export default PickupDetail;
