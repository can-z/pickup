import React, { useState } from "react";
import { gql, useMutation } from '@apollo/client';

import { useHistory } from "react-router-dom";

const EDIT_CUSTOMER = gql`
    mutation EditCustomer($friendlyName:String! $phoneNumber:String!) {
        createUser(friendlyName:$friendlyName, phoneNumber:$phoneNumber) {
            id,
            friendlyName,
            phoneNumber 
        }
    }
`;
const EditCustomer = () => {
    const history = useHistory();
    const manageCustomer = () => {
    history.push("/manage-customer");
    };

    const [ editCustomerName, setEditCustomerName ] = useState('');
    const [ editCustomerNumber, setCustomerNumber ] = useState('');

    const [ createUser ] = useMutation(EDIT_CUSTOMER);
        
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
                        // ref={node => { input = node;}}
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

export default EditCustomer;
