// @flow
import "./AutoSuggest.css";
import "react-datetime/css/react-datetime.css";

import Datetime from "react-datetime";
import React from "react";

const PickupDetail: () => React$Node = () => {
  const fromTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupFromTime",
  };
  const toTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupToTime",
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
        <a role="button" href="/add-pickup" className="btn btn-primary mx-1">
          Save draft
        </a>
        <button type="button" className="btn btn-secondary mx-1">
          Back
        </button>
      </div>
    </div>
  );
};

export default PickupDetail;
