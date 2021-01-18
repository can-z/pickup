import React, { useState } from "react";
import { gql, useMutation } from '@apollo/client';

import { FETCH_CUSTOMER } from "./CustomerList";
import { useHistory } from "react-router-dom";

const CUSTOMER_CREATE = gql`
    mutation CreateCustomer($friendlyName:String! $phoneNumber:String!) {
        createCustomer(friendlyName:$friendlyName, phoneNumber:$phoneNumber) {
            id,
            friendlyName,
            phoneNumber 
        }
    }
`;

const CustomerCreateForm = () => {
    
    const history = useHistory();
    const backToCustomerList = () => {
    history.push("/customer-list");
    };
    
    const [ newCustomerName, setNewCustomerName ] = useState('');
    const [ newCustomerNumber, setNewCustomerNumber ] = useState('');

    const [ createCustomer ] = useMutation(CUSTOMER_CREATE, {
        refetchQueries: [{query: FETCH_CUSTOMER}],
        onCompleted: () => backToCustomerList()
    });
    
        return(
            <div className="container-fluid m-1">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        createCustomer({ variables: {friendlyName: newCustomerName, phoneNumber: newCustomerNumber }});
                    }}
                >
                    <label>Name:
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="New User"
                        value={ newCustomerName }
                        onChange={e => (setNewCustomerName(e.target.value))}
                    />
                    </label>

                    <label>Phone Number:
                    <input 
                        type="text" 
                        name="phonenumber" 
                        placeholder="e.g. +1(xxx)xxx-xxxx"
                        value={ newCustomerNumber }
                        onChange={e => (setNewCustomerNumber(e.target.value))}
                    />
                    </label>
                    <button type="submit" className="btn btn-primary mx-1"> Submit </button>
                </form>

                <div className="container-fluid m-1">
                    <button type="button" onClick={backToCustomerList} className="btn btn-secondary mx-1">
                    Back
                    </button>
                </div>
            </div>      
        );
};

export default CustomerCreateForm;
