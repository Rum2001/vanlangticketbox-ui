import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../authencations/office-365/authConfig';
import { callMsGraph } from '../authencations/office-365/graph';
const CreateEvent = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [scales, setScales] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesResponse, facultiesResponse, locationsResponse, scalesResponse] = await Promise.all([
          axios.get('https://api.boxvlu.click/api/categories'),
          axios.get('https://api.boxvlu.click/api/faculties'),
          axios.get('https://api.boxvlu.click/api/locations'),
          axios.get('https://api.boxvlu.click/api/scales'),
        ]);

        setCategories(categoriesResponse.data);
        setFaculties(facultiesResponse.data);
        setLocations(locationsResponse.data);
        setScales(scalesResponse.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const onChange = (e) => {
    const file = e.target.files[0];
    setValue('file', file); // Sử dụng hàm setValue từ react-hook-form để gán giá trị file cho trường 'file'
  };

  const onSubmit = async (data) => {
    const email = 'thi.197ct33783@vanlanguni.vn';
    const categories_id = 1;
    const faculties_id = 1;
    const locations_id = 1;
    const scales_id = 1;

    // Thêm dữ liệu khác vào object data
    data.categories_id = categories_id;
    data.faculties_id = faculties_id;
    data.locations_id = locations_id;
    data.scales_id = scales_id;
    data.email = email;

    try {
      const formData = new FormData();
      formData.append('file', data.file); // Thêm tệp vào FormData

      // Xóa trường 'file' khỏi object data trước khi gửi request
      delete data.file;

      // Thêm các trường dữ liệu khác vào FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post('https://api.boxvlu.click/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Đặt header 'Content-Type' là 'multipart/form-data' để tải tệp lên
        }
      });

      reset();
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form className='mt-10 mx-12 justify-items-center' onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12 p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div className="border-b border-gray-900/10 pb-12">
          <h1 className="text-bold font-semibold leading-7 text-red-600">THÊM SỰ KIỆN</h1>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
            <div className="sm:col-span-full">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Tên Sự Kiện
              </label>
              <div className="mt-2">
                <input
                  type='text'
                  id="title"
                  name="title"
                  {...register('title', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-full">
              <label htmlFor="categories" className="block text-sm font-medium leading-6 text-gray-900">
                Danh Mục
              </label>
              <div className="mt-2">
                <select
                  id="categories"
                  name="categories"
                  {...register('categories', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-full">
              <label htmlFor="scale" className="block text-sm font-medium leading-6 text-gray-900">
                Quy Mô
              </label>
              <div className="mt-2">
                <select
                  id="scale"
                  name="scales"
                  {...register('scales', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {scales.map((scale) => (
                    <option key={scale.id}>{scale.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-full">
              <label htmlFor="faculty" className="block text-sm font-medium leading-6 text-gray-900">
                Khoa Ban
              </label>
              <div className="mt-2">
                <select
                  id="faculty"
                  name="faculties"
                  {...register('faculties', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {faculties.map((faculty) => (
                    <option key={faculty.id}>{faculty.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-full">
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                Địa điểm
              </label>
              <div className="mt-2">
                <select
                  id="location"
                  name="locations"
                  {...register('locations', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {locations.map((location) => (
                    <option key={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <div className="mr-11">
                <label className="block text-sm font-medium leading-6 text-gray-900">Ngày Bắt Đầu</label>
                <input type='datetime-local' name="start_time" {...register('start_time', { required: true })} />
              </div>
              <div className='ml-11'>
                <label className="block text-sm font-medium leading-6 text-gray-900">Ngày Kết Thúc</label>
                <input type='datetime-local' name="end_time" {...register('end_time', { required: true })} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="descripton" className="block text-sm font-medium leading-6 text-gray-900">
                Mô tả
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  {...register('description', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Viết mô tả dành cho sự kiện của bạn.</p>
            </div>
            <div className="sm:col-span-full">
              <label htmlFor="quanlity_ticket" className="block text-sm font-medium leading-6 text-gray-900">
                Số Lượng
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="quantity_ticket"
                  name="quantity_ticket"
                  {...register('quantity_ticket', { required: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="path" className="block text-sm font-medium leading-6 text-gray-900">
                Hình ảnh
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="path"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="path"
                        name="path"
                        type="file"
                        {...register('path', { required: true })}
                        className="sr-only"
                        onChange={onChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 col-span-full'>
              <button
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Gửi Sự Kiện
              </button>
              <button
                className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Lưu Bản Nháp
              </button>
              <button
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateEvent;
