import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios'
import TopEvent from "./TopEvent";
import ReEvent from "./RegisterEvent";
import { Dialog, Transition } from '@headlessui/react'
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const EventsPage = () => {
    const { id } = useParams();
    const [path, setPath] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [locations, setLocation] = useState('')
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [quanlity_ticket, setQuality] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}`);
                setPath(response.data.path);
                setEmail(response.data.email);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setLocation(response.data.locations);
                setStartTime(response.data.start_time);
                setQuality(response.data.quantity_ticket);
                setEndTime(response.data.end_time);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }
    const handleApproveConfirmation = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/attendees`, {
                email: 'thi.197ct33783@vanlanguni.vn',
                event_name: `${title}`,
                location: `${locations}`,
                start_time: `${start_time}`,

                end_time: `${end_time}`,
            });
            setIsOpen(false);
            if (response.data.status === 'error') {
                toast.error(response.data.message);
            }
            else {
                toast.success("Đăng ký thành công")
            }
        } catch (error) {
            console.error(error);
            toast.error("Đăng ký thất bại");
        }
    };

    return (

        <section className=" bg-gray-50">
            <div className="container mx-auto px-4 relative">
                <div className="block mb-20" data-aos="fade-up" data-aos-delay={300}><img className="object-cover h-min w-full" src={`http://127.0.0.1:8000/api/images/${path}`} alt="freetailwindui.co" /></div>
                <div className="md:flex mb-10 justify-between">
                    <div className="md:w-5/12 mb-5 md:mb-0">
                        <h2 className="font-bold text-xl lg:text-3xl text-gray-700 leading-tight" data-aos="fade-up" data-aos-delay={0}>{title}</h2>
                        <h3 className="font-bold text-xl lg:text-2xl text-blue-600 leading-tight" data-aos="fade-up" data-aos-delay={0}>Địa điểm :{locations}</h3>
                        <h3 className="font-bold text-xl lg:text-2xl text-blue-600 leading-tight" data-aos="fade-up" data-aos-delay={0}>Số lượng vé còn lại :{quanlity_ticket}</h3>
                        <h3 className="font-bold text-xl lg:text-2xl text-blue-600 leading-tight" data-aos="fade-up" data-aos-delay={0}>Thời gian bắt đầu :{start_time}</h3>
                    </div>
                    <div className="md:w-6/12">
                        <p className="text-gray-500 mb-5 leading-relaxed" data-aos="fade-up" data-aos-delay={100}>{description}</p>
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={openModal}
                                className="rounded-md bg-yellow-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                            >
                                Đăng ký ngay
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
                                                    className="text-lg font-medium leading-6 text-gray-900"
                                                >
                                                    Đăng ký nhận vé
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Bạn đang đăng ký nhận vé! Chúng tôi sẽ gửi vé qua email của bạn
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={handleApproveConfirmation}
                                                    >
                                                        Đồng ý!
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>
                    <ToastContainer />
                </div>

            </div>
            <TopEvent />
        </section>
    )
}
export default EventsPage