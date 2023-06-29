import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import ExcelJS from 'exceljs';
import { useZxing } from "react-zxing";
import { Dialog, Transition } from '@headlessui/react'
import * as XLSX from 'xlsx';
const AttendeeTable = (props) => {
    const { id } = useParams();
    const [eventAttendees, setEventAttendees] = useState([]);
    const [eventName, setEventName] = useState('');
    const [checkinDate, setCheckinDate] = useState('')
    const [ticket, setTicket] = useState('');
    const [locations, setLocation] = useState('')
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    console.log(eventAttendees);

    useEffect(() => {
        const fetchData = () => {
            axios
                .get(`https://api.boxvlu.click/api/events/${id}`)
                .then(response => {
                    const eventData = response.data;
                    setEventName(eventData.title);
                    setCheckinDate(eventData.updated_at);
                    setTicket(eventData.quantity_ticket)
                    getAttendeesByEventName(eventData.title);
                    setLocation(eventData.locations);
                    setStartTime(eventData.start_time);
                    setEndTime(eventData.end_time);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        fetchData(); // Gọi API lần đầu tiên

        const interval = setInterval(fetchData, 2000); // Làm mới mỗi 2 giây

        return () => {
            clearInterval(interval); // Hủy bỏ interval khi component unmount
        };
    }, [id]);

    const getAttendeesByEventName = (eventName) => {
        axios
            .get(`https://api.boxvlu.click/api/attendees/event/${eventName}`)
            .then(response => {
                setEventAttendees(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const exportAttendeesToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendees');

        // Thiết lập tiêu đề cho các cột
        worksheet.columns = [
            { header: 'Email', key: 'email', width: 20 },
            { header: 'Trạng Thái', key: 'status', width: 15 },
            { header: 'Ngày Checkin', key: 'checkinDate', width: 15 },
        ];

        // Thêm dữ liệu từ danh sách người tham dự
        eventAttendees.forEach((attendee) => {
            worksheet.addRow({
                email: attendee.email,
                status: attendee.status,
                checkinDate: attendee.updated_at,
            });
        });

        // Tạo file Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'attendees.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        });
    };
    //Scan QR Code
    const [result, setResult] = useState("");
    console.log(result);
    const { ref } = useZxing({
        onResult(result) {
            setResult(result.getText());
        },
    });
    let [isOpen, setIsOpen] = useState(true)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }
    //Điểm danh
    const handleUpdate = () => {
        axios
            .put(`https://api.boxvlu.click/api/attendees/code/${result}`)
            .then(response => {
                console.log(response.data)
                toast.success('Điểm danh thành công')
            })
            .catch(error => {
                console.error(error);
                toast.error('Điểm danh thất bại')
                // Xử lý lỗi nếu có
            });
    };
    // Import file từ Exel
    const [data, setData] = useState([]);
    console.log(data)
    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            const updatedData = parsedData.map((item) => {
                return { ...item, event_name: `${eventName}`, location: `${locations}`, start_time: `${start_time}`, end_time: `${end_time}` };
            });
            setData(updatedData);
        };
    }
    console.log(data)
    const importAttendees = () => {
        data.forEach(attendee => {
            axios
                .post('https://api.boxvlu.click/api/attendees', attendee)
                .then(response => {
                    console.log(response.data);
                    if (response.data.status === 'error') {
                        toast.error(response.data.message);
                    }
                    else{
                        toast.success("Thêm thành công")
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };




    return (
        <div className="p-4">
            <div className="my-2">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a
                                href="#"
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                Trang chủ
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <a
                                    href="http://localhost:3000/myevent"
                                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-blue-600"
                                >
                                    Sự kiện của tôi
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                                    {eventName}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-100">
                <h2 className="my-2">Số vé còn lại:{ticket}</h2>
                <div className="flex items-center justify-between pb-4">
                    <div>
                        {/* Dropdown menu */}
                        <div className="w-full flex items-center justify-items-end">
                            <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" onClick={exportAttendeesToExcel}>Xuất File Excel</button>
                            <div className="flex items-center justify-center mx-2">
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                >
                                    Điểm danh
                                </button>
                            </div>
                            <div>
                                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                                <button
                                    type="button"
                                    onClick={importAttendees}
                                    className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                >
                                    Import
                                </button>
                            </div>

                            <Transition appear show={isOpen} as={Fragment}>
                                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                                        QUÉT MÃ QR ĐIỂM DANH
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Đưa mã QR của bạn vào màn hình camera để thực hiện điểm danh
                                                        </p>
                                                        <div className="scanqr flex flex-col items-center justify-center">
                                                            <div className="relative aspect-w-1 aspect-h-1">
                                                                    <video ref={ref} className="h-[20rem] w-[20rem]" />
                                                            </div>
                                                            <p className="mt-4">
                                                                <span className="font-semibold">Last result: </span>
                                                                <span>{result}</span>
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <div className="mt-4">
                                                        <button
                                                            type="button"
                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                            onClick={handleUpdate}
                                                        >
                                                            Điểm danh
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                        </div>
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
                                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                                placeholder="Tìm kiếm người tham gia"
                            />
                        </div>
                    </form>
                </div>
                <table className="w-full text-sm text-left text-gray-500 light:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 light:bg-gray-700 light:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng Thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ngày Checkin
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventAttendees.map(attendee => (
                            <tr key={attendee.id} className="bg-white border-b light:bg-gray-800 light:border-gray-700 hover:bg-gray-50 light:hover:bg-gray-600">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap light:text-white"
                                >
                                    {attendee.email}
                                </th>
                                <td className="px-6 py-4">{attendee.status}</td>
                                <td className="px-6 py-4">{attendee.updated_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AttendeeTable;
