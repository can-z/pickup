import { gql } from "@apollo/client";

const FETCH_APPOINTMENTS = gql`
  query {
    appointments {
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

export default FETCH_APPOINTMENTS;
