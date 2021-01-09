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
    query($id: ID!) {
        customer(id: $id) {
            friendlyName
            phoneNumber
        }
    }
`;

const CustomerDetails = () => {
    
    const history = useHistory();
    const manageCustomer = () => {
    history.push("/manage-customer");
    };
    const urlInfo = window.location.href.split('/');
    const KnownUserId = urlInfo[4];
    
    const [ editCustomerName, setEditCustomerName ] = useState('');
    const [ editCustomerNumber, setCustomerNumber ] = useState('');

    const FetchCustomerName = (userId) => {
 
        const {loading, error, data } = useQuery(FETCH_CUSTOMER, {
            variables: {id: userId},
        });
        
        if(loading) return <p>Loading...</p>;
        if(error) return <p>Error :(</p>;
    
        return (
            data.customer.friendlyName
        )            
    };

    const FetchCustomerNumber = (userId) => {
 
        const {loading, error, data } = useQuery(FETCH_CUSTOMER, {
            variables: {id: userId},
        });
        
        if(loading) return <p>Loading...</p>;
        if(error) return <p>Error :(</p>;
    
        return (
            data.customer.phoneNumber
        )            
    };

    const [ createUser ] = useMutation(CUSTOMER_DETAILS);

    const knownUserName = FetchCustomerName(KnownUserId);
    
    const knownUserNumber = FetchCustomerNumber(KnownUserId);
        
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
                        placeholder="New User"
                        value={ editCustomerName || knownUserName }
                        onChange={e => (setEditCustomerName(e.target.value))}
                    />
                    </label>

                    <label>Phone Number:
                    <input 
                        type="text" 
                        name="phonenumber" 
                        placeholder="647xxxxxxx"
                        value={ editCustomerNumber || knownUserNumber }
                        onChange={e => (setCustomerNumber(e.target.value))}
                    />
                    </label>
                    <button type="submit" className="btn btn-primary mx-1"> Submit </button>
                </form>

                <div className="container-fluid m-1">
                    <button type="button" onClick={manageCustomer} className="btn btn-secondary mx-1">
                    Back
                    </button>
                    <button type="button" onClick={manageCustomer} className="btn btn-danger mx-1">
                    Delete
                    </button>
                </div>
            </div>      
        );
};

export default CustomerDetails;
