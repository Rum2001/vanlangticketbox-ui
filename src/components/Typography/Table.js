import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios'
import { HiTrash, HiGlobeAlt } from "react-icons/hi";
import { HiEyeSlash, HiEye, HiUserGroup } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../authencations/office-365/authConfig';
import { callMsGraph } from '../authencations/office-365/graph';
const Table = () => {
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
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
    useEffect(() => {
        if (graphData) {
          axios.get(`https://api.boxvlu.click/api/email?email=${accounts[0].username}`)
            .then(response => {
              setData(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          axios.get('https://api.boxvlu.click/api/email?email=none')
            .then(response => {
              setData(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }, [graphData, accounts]);
      
    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categories.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let [isOpenDel, setIsOpenDel] = useState(false)
    function closeDelModal() {
        setIsOpenDel(false)
    }

    function openDelModal() {
        setIsOpenDel(true)
    }
    let [isOpenGlobal, setIsOpenGlobal] = useState(false)
    function closeGolModal() {
        setIsOpenGlobal(false)
    }

    function openGolModal() {
        setIsOpenGlobal(true)
    }
    let [isOpenUnGlobal, setIsOpenUnGlobal] = useState(false)
    function closeUnGolModal() {
        setIsOpenUnGlobal(false)
    }

    function openUnGolModal() {
        setIsOpenUnGlobal(true)
    }
    const handleApproveConfirmation = async () => {
        try {
            const response = await axios.put(`https://api.boxvlu.click/api/events/${id}/status`, {
                status: 'Công Khai',
            });
            setIsOpenGlobal(false);
            toast.success("Công khai thành công")

        } catch (error) {
            toast.error('Công khai thất bại')
            console.error(error);
        }
    };
    const handleUnPublicConfirmation = async () => {
        try {
            const response = await axios.put(`https://api.boxvlu.click/api/events/${id}/status`, {
                status: 'Ẩn',
            });
            setIsOpenUnGlobal(false);
            toast.success("Sự kiện đã chuyển sang trạng thái ẩn")

        } catch (error) {
            toast.error('Ẩn sự kiện thất bại')
            console.error(error);
        }
    };
    const deleteEvent = () => {
        axios.delete(`https://api.boxvlu.click/api/events/${id}`)
            .then(response => {
                console.log(response.data);
                setIsOpenDel(false)
                toast.success("Xóa Thành Công")
                // Nếu xóa người dùng thành công, có thể thực hiện các hành động khác ở đây
            })
            .catch(error => {
                console.log(error);
                toast.error("Xóa Thất Bại")
                // Nếu xảy ra lỗi khi xóa người dùng, có thể xử lý lỗi ở đây
            });
    }
    return (
        <div className="p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-100">
                <div className="flex items-center justify-between pb-4">
                    <div>
                        {/* Dropdown menu */}
                        <div
                            id="dropdownRadio"
                            className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow light:bg-gray-700 light:divide-gray-600"
                            data-popper-reference-hidden=""
                            data-popper-escaped=""
                            data-popper-placement="top"
                            style={{
                                position: "absolute",
                                inset: "auto auto 0px 0px",
                                margin: 0,
                                transform: "translate3d(522.5px, 3847.5px, 0px)"
                            }}
                        >
                        </div>
                    </div>
                    <form>
                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500 light:text-gray-400"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                                placeholder="Tìm kiếm sự kiện"
                            />
                        </div>
                    </form>
                </div>
                <table className="w-full text-sm text-left text-gray-500 light:text-gray-400" >
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 light:bg-gray-700 light:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Sự Kiện
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Danh Mục
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Địa Điểm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng Thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hành Động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(event => (
                            <tr key={event.id} className="bg-white border-b light:bg-gray-800 light:border-gray-700 hover:bg-gray-50 light:hover:bg-gray-600">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap light:text-white"
                                >
                                    {event.title}
                                </th>
                                <td className="px-6 py-4">{event.categories}</td>
                                <td className="px-6 py-4">{event.locations}</td>
                                <td className="px-6 py-4">{event.status}</td>
                                {/*  */}
                                <div className="flex justify-center items-center">
                                    <div className="mx-1 flex items-center justify-center">
                                        <Link to={`/myevent/delete/${event.id}`}>
                                            <button
                                                type="button"
                                                onClick={openDelModal}
                                                className="rounded-md bg-red-600 px-4 py-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                            >
                                                <HiTrash />
                                            </button>
                                        </Link>
                                    </div>

                                    <Transition appear show={isOpenDel} as={Fragment}>
                                        <Dialog as="div" className="relative z-10" onClose={closeDelModal}>
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                                            </Transition.Child>

                                            <div className="fixed inset-0 overflow-y-auto">
                                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                    <Transition.Child
                                                        as={Fragment}
                                                        enter="ease-out duration-300"
                                                        enterFrom="opacity-0 scale-95"
                                                        enterTo="opacity-100 scale-100"
                                                        leave="ease-in duration-200"
                                                        leaveFrom="opacity-100 scale-100"
                                                        leaveTo="opacity-0 scale-95"
                                                    >
                                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                                            <Dialog.Title
                                                                as="h3"
                                                                className="text-lg font-medium leading-6 text-gray-900"
                                                            >
                                                                Xác nhận xóa sự kiện
                                                            </Dialog.Title>
                                                            <div className="mt-2">
                                                                <p className="text-sm text-red-500">
                                                                    Bạn có đồng ý xóa sự kiện này không ?
                                                                </p>
                                                            </div>

                                                            <div className="mt-4">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                    onClick={deleteEvent}
                                                                >
                                                                    Đồng ý, xóa
                                                                </button>
                                                            </div>
                                                        </Dialog.Panel>
                                                    </Transition.Child>
                                                </div>
                                            </div>
                                        </Dialog>
                                    </Transition>
                                    {event.status === 'Đã duyệt' || event.status === 'Ẩn' ? (
                                        <div>
                                            <div className="mx-1 flex items-center justify-center">
                                                <Link to={`/myevent/public/${event.id}`}>
                                                    <button
                                                        type="button"
                                                        onClick={openGolModal}
                                                        className="rounded-md bg-blue-600 px-4 py-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                    >
                                                        <HiEye />
                                                    </button>
                                                </Link>
                                                <Link className="mx-1" to={`/myevent/attendee/${event.id}`}>
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-green-600 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                    >
                                                        <HiUserGroup />
                                                    </button>
                                                </Link>
                                            </div>

                                            <Transition appear show={isOpenGlobal} as={Fragment}>
                                                <Dialog as="div" className="relative z-10" onClose={closeGolModal}>
                                                    <Transition.Child
                                                        as={Fragment}
                                                        enter="ease-out duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="ease-in duration-200"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                                                    </Transition.Child>

                                                    <div className="fixed inset-0 overflow-y-auto">
                                                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                            <Transition.Child
                                                                as={Fragment}
                                                                enter="ease-out duration-300"
                                                                enterFrom="opacity-0 scale-95"
                                                                enterTo="opacity-100 scale-100"
                                                                leave="ease-in duration-200"
                                                                leaveFrom="opacity-100 scale-100"
                                                                leaveTo="opacity-0 scale-95"
                                                            >
                                                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                                                    <Dialog.Title
                                                                        as="h3"
                                                                        className="text-lg font-medium leading-6 text-blue-600"
                                                                    >
                                                                        CÔNG KHAI SỰ KIỆN
                                                                    </Dialog.Title>
                                                                    <div className="mt-2">
                                                                        <p className="text-sm text-gray-500">
                                                                            Bạn có muốn công khai sự kiện này?
                                                                        </p>
                                                                    </div>

                                                                    <div className="mt-4">
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                            onClick={handleApproveConfirmation}
                                                                        >
                                                                            Đồng ý
                                                                        </button>
                                                                    </div>
                                                                </Dialog.Panel>
                                                            </Transition.Child>
                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </Transition>
                                        </div>
                                    ) : event.status === 'Công Khai' ? (
                                        <div>
                                            <div className="mx-1 flex items-center justify-center">
                                                <Link className="mx-1" to={`/myevent/public/${event.id}`}>
                                                    <button
                                                        type="button"
                                                        onClick={openUnGolModal}
                                                        className="rounded-md bg-yellow-600 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                    >
                                                        <HiEyeSlash />
                                                    </button>
                                                </Link>
                                                <Link className="mx-1" to={`/myevent/attendee/${event.id}`}>
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-green-600 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                    >
                                                        <HiUserGroup />
                                                    </button>
                                                </Link>
                                            </div>

                                            <Transition appear show={isOpenUnGlobal} as={Fragment}>
                                                <Dialog as="div" className="relative z-10" onClose={closeUnGolModal}>
                                                    <Transition.Child
                                                        as={Fragment}
                                                        enter="ease-out duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="ease-in duration-200"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                                                    </Transition.Child>

                                                    <div className="fixed inset-0 overflow-y-auto">
                                                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                            <Transition.Child
                                                                as={Fragment}
                                                                enter="ease-out duration-300"
                                                                enterFrom="opacity-0 scale-95"
                                                                enterTo="opacity-100 scale-100"
                                                                leave="ease-in duration-200"
                                                                leaveFrom="opacity-100 scale-100"
                                                                leaveTo="opacity-0 scale-95"
                                                            >
                                                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                                                    <Dialog.Title
                                                                        as="h3"
                                                                        className="text-lg font-medium leading-6 text-gray-900"
                                                                    >
                                                                        ẨN SỰ KIỆN
                                                                    </Dialog.Title>
                                                                    <div className="mt-2">
                                                                        <p className="text-sm text-gray-500">
                                                                            Bạn có muốn ẩn sự kiện này?
                                                                        </p>
                                                                    </div>

                                                                    <div className="mt-4">
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                            onClick={handleUnPublicConfirmation}
                                                                        >
                                                                            Đồng ý
                                                                        </button>
                                                                    </div>
                                                                </Dialog.Panel>
                                                            </Transition.Child>
                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </Transition>
                                        </div>
                                    ) : (
                                        <div>

                                        </div>
                                    )}
                                </div>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    )
}
export default Table
