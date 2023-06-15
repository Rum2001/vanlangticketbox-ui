import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useMsal } from '@azure/msal-react';
import { msalInstance } from '../authencations/office-365/authConfig';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';

export default function ReEvent() {
  let [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const { accounts } = useMsal();
  const [mail, setEmail] = useState([]);
  const email = mail.resemail
  console.log(email);
  const getAccountInfo = async () => {
    const account = await msalInstance.getAccountByLocalId(accounts[0].localAccountId);
    const resemail = account.username;
    console.log(account)
    // update the state with the user info...
    setEmail({ resemail })
  };
  useEffect(() => {
    if (accounts.length > 0) {
      getAccountInfo();
    }
  }, [accounts]);
  const { id } = useParams();
  const [path, setPath] = useState('')
  const [event_name, setTitle] = useState('')
  console.log(event_name)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [start_time, setStartTime] = useState('')
  const [quanlity_ticket, setQuality] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}`);
        setPath(response.data.path);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setLocation(response.data.location);
        setStartTime(response.data.start_time);
        setQuality(response.data.quantity_ticket)

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);
  const [verify_code, setVerifyCode] = useState('');
  const generateVerifyCode = async () => {
    const data = `${email} - ${event_name}`;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data);
      setVerifyCode(qrCodeDataUrl);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/attendees', {
        email,
        event_name,
        verify_code,
      });
      console.log(response.data); // Xử lý dữ liệu trả về từ server
      generateVerifyCode();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Đăng ký sự kiện
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <form onSubmit={handleSubmit}>
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
                      Đăng ký sự kiện
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn đồng ý tham gia sự kiện này chứ ?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        
                      >
                        Đăng ký!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </form>
      </Transition>
    </>
  )
}
