import React from 'react';
import { motion } from 'framer-motion';
import {Link } from 'react-router-dom'
const AddEvent = () => {
  return (
    <div className="bg-[#C7CEEA] min-h-min flex justify-center items-center p-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 text-red-600">Tạo sự kiện của bạn ngay hôm nay</h1>
        <div className="flex justify-center">
         <Link to={'/myevent'}>
         <button className="bg-[#F2F2F2] text-[#111111] font-semibold px-7 py-3 rounded mr-4">Bắt Đầu</button>
         </Link>
         
        </div>
      </motion.div>
    </div>
  );
};

export default AddEvent;
