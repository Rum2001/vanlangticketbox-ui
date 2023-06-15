import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '../../assets/image/logo.png'
import { useMsal } from '@azure/msal-react';
import { logout, msalInstance } from '../authencations/office-365/authConfig';

const navigationData = [
    { name: 'Trang chủ', href: '/home', current: false },
    { name: 'Hội nghị - Sự kiện', href: '/listevent', current: false },
    { name: 'Sự kiện của tôi', href: '/myevent', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
    const [navigation, setNavigation] = useState(navigationData);
    const { accounts } = useMsal();
    const [user, setUser] = useState(null);
    const [mail, setEmail] = useState(null);
    console.log(user);
    console.log(mail);  

    const handleLinkClick = (index) => {
        const updatedNavigation = navigation.map((item, i) => {
            if (i === index) {
                return { ...item, current: true };
            } else {
                return { ...item, current: false };
            }
        });
        setNavigation(updatedNavigation);
    };

    const getAccountInfo = async () => {
        const account = await msalInstance.getAccountByLocalId(accounts[0].localAccountId);
        const displayName = account.name;
        const email = account.username;
        const avatarUrl = account.avatar;
        console.log(account)
        // update the state with the user info...
        setEmail({ email })
        setUser({ displayName, email, avatarUrl });
    };

    useEffect(() => {
        if (accounts.length > 0) {
            getAccountInfo();
        }
    }, [accounts]);

    const handleLogout = () => {
        logout();
    };

    return (
        <Disclosure as="nav" className="top-0 bg-gray-100">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400  hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-8 w-auto lg:hidden"
                                        src={`${Logo}`}
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-8 w-auto lg:block"
                                        src={`${Logo}`}
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item, index) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'text-red-700' : 'text-gray-900  hover:text-red-700',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                                onClick={() => handleLinkClick(index)}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                {user ? (
                                    <div className='flex items-center'>
                                        <div className='mx-2 text-gray-900  hover:text-red-700 rounded-md px-3 py-2 text-sm font-medium hidden sm:ml-6 sm:block'>Xin chào, {user.displayName} </div>
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src='https://img.freepik.com/free-icon/user_318-159711.jpg'
                                                        alt=""
                                                    />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Thông tin
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                onClick={handleLogout}
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Đăng xuất
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                ) : (
                                        <a className='text-gray-900  hover:text-red-700 rounded-md px-3 py-2 text-sm font-medium' href='/login'>Đăng nhập / Đăng ký</a>
                                    )}
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item,index) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'text-red-900' : 'text-gray-900  hover:text-red-700',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                    onClick={() => handleLinkClick(index)}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
