import React, { useState, useEffect } from 'react';
import SideBar from "../Typography/SideBar";
import NavBar from "../Typography/navbar";
import Footer from "../Typography/Footer";
import Table from "../Typography/Table";
import CreateEventModal from '../Typography/CreateEV';
import { HiArrowLeft } from "react-icons/hi2"
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../authencations/office-365/authConfig';
import { callMsGraph } from '../authencations/office-365/graph';
const MyEvents = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }
    useEffect(() => {
        RequestProfileData();
    }, []);
    const [showTable, setShowTable] = useState(true);

    const handleToggleView = () => {
        setShowTable(!showTable);
    };

    return (
        <div>
            <div className="flex">
                <SideBar />
                <div className='w-full container mt-10 p-3'>
                    <div className="">
                        {showTable ?
                            <div>
                                {graphData ?
                                (<button
                                    type="button"
                                    onClick={handleToggleView}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                >
                                    Thêm sự kiện
                                </button>):(
                                    <div></div>
                                )}
                            </div> :
                            <a className='flex items-center gap-1 font-bold text-red-600 dark:text-red-500 hover:underline' href='/myevent'><HiArrowLeft /> Quay lại</a>}
                    </div>
                    {showTable ? <Table /> : <CreateEventModal />}
                </div>
            </div>
        </div >
    )
}
export default MyEvents
