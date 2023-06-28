import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authencations/office-365/authConfig";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/image/logo.png'
import backgroundImage from '../../assets/image/06f40f5d1231c77145726465eece3b48.jpeg'
const Login = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
      if (loginType === "popup") {
          instance.loginPopup(loginRequest).catch(e => {
              console.log(e);
          });
      } else if (loginType === "redirect") {
          instance.loginRedirect(loginRequest).catch(e => {
              console.log(e);
          });
      }
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://api.boxvlu.click/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('name', response.data.name);

      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error("Sai Email hoặc Passwords")
    }
  };

  const handleRememberMe = (event) => {
    setRememberMe(event.target.checked);

    if (event.target.checked) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className=''>
      {/* component */}
      {/* Container */}
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
          {/* Row */}
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            {/* Col */}
            <div className="bg-center bg-cover w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg" style={{ backgroundImage: `url(${backgroundImage})` }} />
            {/* Col */}
            <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none border-inherit">
              <img
                className=""
                src={`${Logo}`}
                alt="Your Company"
              />
              <h1 className="pt-4 text-2xl text-center font-bold text-[#FF3333]">ĐĂNG NHẬP</h1>
              <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="Email">
                    Email
                  </label>
                  <input className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                    Mật Khẩu
                  </label>
                  <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div className="mb-4">
                  <input className="mr-2 leading-tight" type="checkbox" id="checkbox_id" checked={rememberMe} onChange={handleRememberMe} />
                  <label className="text-sm" htmlFor="checkbox_id">
                    Ghi nhớ
                  </label>
                </div>
                <div className="mb-6 text-center">
                  <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="submit">
                    Đăng Nhập
                  </button>
                  <div className="inline-flex items-center justify-center w-full">
                    <hr className="relative w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                      or
                    </span>
                  </div>
                  <button onClick={() => handleLogin("popup")} className="w-full my-3 px-4 py-2 font-bold text-white bg-orange-600 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="button">
                    Đăng Nhập Bằng Tài Khoản Office 365
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800" href="#">
                    Đăng Ký Tài Khoản Mới
                  </a>
                </div>
                <div className="text-center">
                  <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800" href="#">
                    Quên Mật Khẩu?
                  </a>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;