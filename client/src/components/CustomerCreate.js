import React, { useState } from "react";
import { gql, useMutation } from '@apollo/client';

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
const CustomerCreate = () => {
    const history = useHistory();
    const backToLanding = () => {
    history.push("/manage-customer");
    };

    const [ newCustomerName, setNewCustomerName ] = useState('');
    const [ newCustomerNumber, setNewCustomerNumber ] = useState('');

    const [ createUser ] = useMutation(CUSTOMER_CREATE);
        
        return(
            <div className="container-fluid m-1">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        createUser({ variables: {friendlyName: newCustomerName, phoneNumber: newCustomerNumber }});
                    }}
                >
                    <label>Name:
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Give a name"
                        value={newCustomerName}
                        onChange={e => (setNewCustomerName(e.target.value))}
                    />
                    </label>
                    <label>Phone Number:
                    <input 
                        type="text" 
                        name="phonenumber" 
                        placeholder="Give a number"
                        value={newCustomerNumber}
                        onChange={e => (setNewCustomerNumber(e.target.value))}
                    />
                    </label>

                    <button type="submit" className="btn btn-primary mx-1"> Submit </button>
                </form>

                <div className="container-fluid m-1">
                    <button type="button" onClick={backToLanding} className="btn btn-secondary mx-1">
                    Back
                    </button>
                </div>
            </div>      
        );
};

export default CustomerCreate;
