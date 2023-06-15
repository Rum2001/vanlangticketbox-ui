import React, { useState } from 'react';
import SideBar from "../Typography/SideBar";
import TableTicket from '../Typography/TableTicket';
import {HiArrowLeft} from "react-icons/hi2"
const Tickets = () => {
    const [showTable, setShowTable] = useState(true);

    const handleToggleView = () => {
        setShowTable(!showTable);
    };

    return (
        <div>
            <div className="flex">
                <SideBar />
                <div className='w-full container mt-10 p-3'>
                    <TableTicket /> 
                </div>
            </div>
        </div>
    )
}
export default Tickets;
