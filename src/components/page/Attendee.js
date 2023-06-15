import React, { useState } from 'react';
import SideBar from "../Typography/SideBar";
import AttendeeTable from '../Typography/AttendeeTable';
import CreateEventModal from '../Typography/CreateEV';
import {HiArrowLeft} from "react-icons/hi2"
import { Link } from 'react-router-dom';
const Attendee = () => {

    return (
        <div>
            <div className="flex">
                <SideBar />
                <div className='w-full container mt-10 p-3'>
                <Link
                to={'/myevent'}
                            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                        >
                            Quay lại
                </Link>
                    <AttendeeTable/>   
                </div>
            </div>
        </div>
    )
}
export default Attendee;
