// @flow

import "react-datetime/css/react-datetime.css";

import { gql, useMutation, useQuery } from "@apollo/client";

import AppointmentForm from "./AppointmentForm";
import FETCH_APPOINTMENTS from "./fetchAppointments";
import React from "react";
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

const FETCH_APPOINTMENT = gql`
  query Appointment($id: ID!) {
    appointment(id: $id) {
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

const editAppointment = () => {};

const CreateOrUpdateAppointment: () => React$Node = (props) => {
  const history = useHistory();
  const backToLanding = () => {
    history.push("/");
  };

  if (props.match === undefined) {
    const CreateAppointment = () => {
      const [
        createAppointment,
        { loading: mutationLoading, error: mutationError },
      ] = useMutation(CREATE_APPOINTMENT, {
        refetchQueries: [{ query: FETCH_APPOINTMENTS }],
        onCompleted: () => backToLanding(),
      });

      return (
        <div>
          <AppointmentForm
            fromTime={null}
            toTime={null}
            appointmentUpdate={createAppointment}
          />
          {/* <div>{FetchAppointmnet()}</div> */}
          {mutationLoading && <p>Loading...{}</p>}
          {mutationError && <p>Error:( Sorry, something wrong happened.</p>}
        </div>
      );
    };
    return <div>{CreateAppointment()}</div>;
  } else {
    const EditAppointment = () => {
      const { loading, error, data } = useQuery(FETCH_APPOINTMENT, {
        variables: { id: props.match.params.userId },
      });

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <div>
          <AppointmentForm
            fromTime={data.appointment.startTime}
            toTime={data.appointment.endTime}
            address={data.appointment.location.address}
            appointmentUpdate={editAppointment}
          />
        </div>
      );
    };

    return <div>{EditAppointment()}</div>;
  }
};

export default CreateOrUpdateAppointment;
