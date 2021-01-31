import {FETCH_APPOINTMENTS} from './PickupList';
import React from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';

const AppointmentData = () => {
    const {loading, error, data} = useQuery(FETCH_APPOINTMENTS);
    
    if(loading) return <tr><td>Loading...</td></tr>;
    if(error) return <tr><td>Something wrong happend :(</td></tr>;

    return (
      data.appointments.map( ({id, startTime, endTime, location}) => (
        <tr key={id}>
            <td>{moment.unix(startTime).format("LLL")} - {moment.unix(endTime).format("LLL")}</td>
            <td>{location.address}</td>
            <td></td>
        </tr>
    ))
    )    
  }

  export default AppointmentData;