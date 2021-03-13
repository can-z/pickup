// @flow

import "react-datetime/css/react-datetime.css";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import Datetime from "react-datetime";
import FETCH_APPOINTMENTS from "./fetchAppointments";
import moment from "moment";
import { useHistory } from "react-router-dom";

const CREATE_APPOINTMENT = gql`
  mutation createAppointment(
    $startTime: Int!
    $endTime: Int!
    $address: String!
    $note: String!
  ) {
    createAppointment(
      startTime: $startTime
      endTime: $endTime
      address: $address
      note: $note
    ) {
      id
    }
  }
`;

const AppointmentCreateForm: () => React$Node = () => {
  const history = useHistory();
  const backToLanding = () => {
    history.push("/");
  };

  const [newFromTime, setNewFromTime] = useState("");
  const [newToTime, setNewToTime] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNote, setNewNote] = useState(" ");

  const [
    createAppointment,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [{ query: FETCH_APPOINTMENTS }],
    onCompleted: () => backToLanding(),
  });

  const fromTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupFromTime",
    required: "required",
  };
  const toTimeInputProps = {
    placeholder: "Click to open time picker",
    id: "pickupToTime",
    required: "required",
  };

  const timeStampFormat = (time) => moment(time).unix();
  var fromTime = timeStampFormat(newFromTime);
  var toTime = timeStampFormat(newToTime);

  const handleSubmit = () => {
    if (fromTime >= toTime) {
      return [
        false,
        alert(
          "Oops, 'End Time' must happen after 'Start time'! \n Please try again."
        ),
      ];
    } else {
      return createAppointment({
        variables: {
          startTime: fromTime,
          endTime: toTime,
          address: newAddress,
          note: newNote,
        },
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <div className="container-fluid m-1">
            <label htmlFor="pickupFromTime">
              Start time
              <Datetime
                inputProps={fromTimeInputProps}
                dateFormat={true}
                timeFormat={true}
                value={newFromTime}
                onChange={(value) => setNewFromTime(value)}
              />
            </label>
          </div>

          <div className="container-fluid m-1">
            <label htmlFor="pickupToTime">
              End time
              <Datetime
                inputProps={toTimeInputProps}
                dateFormat={true}
                timeFormat={true}
                value={newToTime}
                onChange={(value) => setNewToTime(value)}
              />
            </label>
          </div>

          <div className="container-fluid m-1">
            <label htmlFor="pickupLocation">
              Address
              <input
                className="form-control"
                id="pickupLocation"
                placeholder="Enter address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required="required"
              />
            </label>
          </div>

          <div className="container-fluid m-1">
            <label htmlFor="pickupDetails">
              Pickup details (Optional)
              <input
                className="form-control"
                id="pickupDetails"
                placeholder="Further instructions on the pickup location"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </label>
          </div>
          <div className="container-fluid m-1">
            <button type="submit" className="btn btn-primary mx-1">
              Save draft
            </button>
            <button
              type="button"
              onClick={backToLanding}
              className="btn btn-secondary mx-1"
            >
              Back
            </button>
          </div>
        </div>
      </form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error:( Sorry, something wrong happened.</p>}
    </div>
  );
};

export default AppointmentCreateForm;
