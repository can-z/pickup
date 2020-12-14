import "./AutoSuggest.css";

import { AiOutlineEdit } from 'react-icons/ai';
import React from "react";
import { useHistory } from "react-router-dom";

const ManageCustomer = () => {
    const history = useHistory();
    const backToLanding = () => {
    history.push("/");
    };
    const modifyCustomer = () => {
    history.push("/modify-customer")
    };

    return (
         <div>
            <div class="container-fluid m-1">
                <button type="button" className="btn btn-secondary mx-1">New Customer</button>
            </div>
            
            <div class="container-fluid m-1">
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Modify</th>  
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Roger</td>
                        <td>roger@gmail.com</td>
                        <td><button type="button" className="btn btn-light mx-1" onClick={modifyCustomer}><AiOutlineEdit size={32}/></button></td>
                        </tr>
                        <tr>
                        <td>Wei</td>
                        <td>wei@hotmail.com</td>
                        <td><button type="button" className="btn btn-light mx-1"><AiOutlineEdit size={32}/></button></td>
                        </tr>
                        <tr>
                        <td>Ray</td>
                        <td>ray@qq.com</td>
                        <td><button type="button" className="btn btn-light mx-1"><AiOutlineEdit size={32}/></button></td>
                        </tr>
                    </tbody>
                </table> 
            </div>

            <div class="container-fluid m-1">
                <button type="button" onClick={backToLanding} className="btn btn-secondary mx-1">
                Back
                </button>
            </div>

            
        </div>
    );
};

export default ManageCustomer;
