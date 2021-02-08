import React, { useState } from "react";

import Datetime from "react-datetime";
import moment from "moment";
import { useHistory } from "react-router-dom";

const AppointmentForm = (props) => {
  const history = useHistory();
  const backToLanding = () => {
    history.push("/");
  };
  const defaultFromTime = () => {
    if (props.fromTime == null) {
      return "";
    } else {
      return moment.unix(props.fromTime).format("DD/MM/YYYY hh:mm");
    }
  };

  const defaultToTime = () => {
    if (props.toTime == null) {
      return "";
    } else {
      return moment.unix(props.toTime).format("DD/MM/YYYY hh:mm");
    }
  };

  const [newFromTime, setNewFromTime] = useState(defaultFromTime());
  const [newToTime, setNewToTime] = useState(defaultToTime);
  const [newAddress, setNewAddress] = useState("");
  const [newNote, setNewNote] = useState(" ");

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
      return props.appointmentUpdate({
        variables: {
          startTime: fromTime,
          endTime: toTime,
          address: newAddress,
          note: newNote,
        },
      });
    }
  };

  //   const fromTimeValue = () => {
  //     if (!props.fromTime) {
  //       return newFromTime;
  //     } else {
  //       return moment.unix(props.fromTime).format("DD/MM/YYYY hh:mm");
  //     }
  //   };

  const toTimeValue = () => {
    if (!props.toTime) {
      return newToTime;
    } else {
      return moment.unix(props.toTime).format("DD/MM/YYYY hh:mm");
    }
  };

  const addressValue = () => {
    if (!props.address) {
      return newAddress;
    } else {
      return props.address;
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
                value={toTimeValue()}
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
                value={addressValue()}
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
    </div>
  );
};

export default AppointmentForm;
