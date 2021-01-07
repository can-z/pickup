import React, { useState } from "react";
import { gql, useMutation, useQuery } from '@apollo/client';

import { useHistory } from "react-router-dom";

const CUSTOMER_DETAILS = gql`
    mutation EditCustomer($friendlyName:String! $phoneNumber:String!) {
        createUser(friendlyName:$friendlyName, phoneNumber:$phoneNumber) {
            id,
            friendlyName,
            phoneNumber 
        }
    }
`;

const FETCH_CUSTOMER = gql`
    query Customer($id: String! ) {
        customer(id: $id) {
            id
            friendlyName
        }
    }
`;

const CustomerDetails = () => {
    
    const history = useHistory();
    const manageCustomer = () => {
    history.push("/manage-customer");
    };
    const urlInfo = window.location.href.split('/');
    const KnownUserName = urlInfo[4];
    
    const [ editCustomerName, setEditCustomerName ] = useState('');
    const [ editCustomerNumber, setCustomerNumber ] = useState('');

    const FetchCustomer = () => {
 
        const {loading, error, data } = useQuery(FETCH_CUSTOMER, {
            variables: 5,
        });
        
        if(loading) return <p>Loading...</p>;
        if(error) return <p>Error :(</p>;
    
        return (
            <p>{data.customer.friendlyName}</p>
        )            
    };

    const [ createUser ] = useMutation(CUSTOMER_DETAILS);
        
        return(
            <div className="container-fluid m-1">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        createUser({ variables: {friendlyName: editCustomerName, phoneNumber: editCustomerNumber }});
                    }}
                >
                    <label>Name:
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Give a name"
                        value={editCustomerName}
                        onChange={e => (setEditCustomerName(e.target.value))}
                    />
                    </label>

                    <label>Phone Number:
                    <input 
                        type="text" 
                        name="phonenumber" 
                        placeholder="Give a number"
                        value={editCustomerNumber}
                        onChange={e => (setCustomerNumber(e.target.value))}
                    />
                    </label>

                    <button type="submit" className="btn btn-primary mx-1"> Submit </button>
                </form>
                {FetchCustomer()}

                <div className="container-fluid m-1">
                    <button type="button" onClick={manageCustomer} className="btn btn-secondary mx-1">
                    Back
                    </button>
                    {/* <button type="button" onClick={manageCustomer} className="btn btn-danger mx-1">
                    Delete
                    </button> */}
                </div>
            </div>      
        );
};

export default CustomerDetails;
