import "./AutoSuggest.css";

import { AiOutlineEdit } from 'react-icons/ai';
import React from "react";
import { useHistory } from "react-router-dom";

const ModifyCustomer = () => {
    const history = useHistory();
    const manageCustomer = () => {
    history.push("/manage-customer");
    };
    const modifyCustomer = () => {
    history.push("/modify-customer");
    };

    return (
        <div>
        
        <div class="container-fluid m-1">
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>   
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td><input type="text" placeholder="Roger" /></td>
                    <td><input type="text" placeholder="roger@gmail.com" /></td>
                    </tr>
                </tbody>
            </table> 
        </div>

        <div class="container-fluid m-1">
            <button type="button" onClick={manageCustomer} className="btn btn-secondary mx-1">
            Back
            </button>
            <button type="button" onClick={manageCustomer} className="btn btn-primary mx-1">
            Save
            </button>
            <button type="button" onClick={manageCustomer} className="btn btn-danger mx-1">
            Delete
            </button>
        </div>

        
    </div>
    )
};

export default ModifyCustomer;
