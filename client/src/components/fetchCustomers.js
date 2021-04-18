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
export default FETCH_CUSTOMERS;
