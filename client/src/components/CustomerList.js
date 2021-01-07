import { gql, useQuery } from '@apollo/client';

import { AiOutlineEdit } from 'react-icons/ai';
import React from "react";
import { useHistory } from "react-router-dom";

const FETCH_CUSTOMER = gql`
query {
  customers {
    id
    friendlyName
    phoneNumber
  }
}
`;

const CustomerList = () => {
    const history = useHistory();
    const backToLanding = () => {
        history.push("/");
    };
    const ModifyCustomer = (id) => {
        history.push(`/modify-a-customer/${id}`)
    };
    const CreateCustomer = (friendlyName) => {
        history.push("/create-a-customer")
    };  

    const CustomerData = () => {
 
        const {loading, error, data } = useQuery(FETCH_CUSTOMER);
    
        if(loading) return <tr><td>Loading...</td></tr>;
        if(error) return <tr><td>Loading...</td></tr>;
    
        return data.customers.map( ({id, friendlyName, phoneNumber}) => (
            <tr key={id}>
                <td>{id}</td>
                <td>{friendlyName}</td>
                <td>{phoneNumber}</td>
                <td>
                    <button type="button" className="btn btn-light mx-1" onClick={() => ModifyCustomer(id)} ><AiOutlineEdit size={32}/>
                    </button>
                </td>
            </tr>
        ));
    };

    return(
         <div>
            
            <div className="container-fluid m-1">
                <button type="button" className="btn btn-primary mx-1" onClick={CreateCustomer}>New Customer</button>
                <button type="button" onClick={backToLanding} className="btn btn-secondary mx-1">
                Back
                </button>
            </div>
            
            <div className="container-fluid m-1">
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Number</th>
                        <th scope="col">Modify</th>  
                        </tr>
                    </thead>
                    <tbody>
                        {CustomerData()}
                    </tbody>
                </table> 
            </div>
            
        </div>
    );
};

export default CustomerList;