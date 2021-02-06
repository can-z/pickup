import FETCH_APPOINTMENTS from "./fetchAppointments";
import React from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

const AppointmentTable = () => {
  const history = useHistory();
  const goToEditAppointmentPage = (id) => {
    history.push(`/edit-appointment/${id}`);
  };
  const AppointmentData = () => {
    const { loading, error, data } = useQuery(FETCH_APPOINTMENTS);

    if (loading)
      return (
        <tr>
          <td>Loading...</td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td>Something wrong happend :(</td>
        </tr>
      );

    return data.appointments.map(({ id, startTime, endTime, location }) => (
      <tr key={id} onClick={() => goToEditAppointmentPage(id)}>
        <td>
          {moment.unix(startTime).format("LLL")} -{" "}
          {moment.unix(endTime).format("LLL")}
        </td>
        <td>{location.address}</td>
        <td>{id}</td>
      </tr>
    ));
  };

  return (
    <div>
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Location</th>
            <th scope="col">Confirmed customers</th>
          </tr>
        </thead>
        <tbody>{AppointmentData()}</tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
