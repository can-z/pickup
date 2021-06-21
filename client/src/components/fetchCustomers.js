import { gql } from "@apollo/client";

const FETCH_CUSTOMERS = gql`
  query {
    customers {
      id
      friendlyName
      phoneNumber
    }
  }
`;

export { FETCH_CUSTOMERS };
