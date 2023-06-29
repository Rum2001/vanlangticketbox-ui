import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
    const location = useLocation();

    return (
        <div className="">
            <aside
                id="default-sidebar"
                className="z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100 light:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink
                                to="/myevent"
                                className={`flex items-center p-2 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 ${location.pathname === "/myevent" ? "text-red-600" : "text-gray-900"
                                    }`}
                            >
                                <span className="ml-3">Sự kiện của tôi</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/myevent/ticket"
                                className={`flex items-center p-2 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 ${location.pathname === "/myevent/ticket" ? "text-red-600" : "text-gray-900"
                                    }`}
                            >
                                <span className="flex-1 ml-3 whitespace-nowrap">Sự kiện đã đăng ký</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default SideBar;
