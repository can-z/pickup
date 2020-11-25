// @flow
import React, { useState } from "react";
import Datetime from "react-datetime";
import Autocomplete from "react-autocomplete";
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
  let [selectedUser] = useState("");
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
        <form>
          <div className="form-group">
            <label htmlFor="pickupLocation">Location</label>
            <input
              className="form-control"
              id="pickupLocation"
              placeholder="Enter address"
            />
          </div>
        </form>
      </div>
      <div className="container-fluid m-1">
        <form>
          <div className="form-group">
            <div>
              <label htmlFor="customerList" className="m-1">
                Customers
              </label>
            </div>
            <Autocomplete
              getItemValue={(item) => item.label}
              items={[
                { label: "apple" },
                { label: "banana" },
                { label: "pear" },
              ]}
              renderItem={(item, isHighlighted) => (
                <div
                  style={{ background: isHighlighted ? "lightgray" : "white" }}
                >
                  {item.label}
                </div>
              )}
              value={selectedUser}
              menuStyle={{
                fontSize: "110%",
              }}
              onChange={(e) => (selectedUser = e.target.value)}
              onSelect={(val) => {
                selectedUser = val;
                console.log(`adding ${selectedUser}`);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickupDetail;
