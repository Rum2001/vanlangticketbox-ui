import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Hero = () => {
    const [data,setData] = useState([])
    useEffect(() => {
        axios.get(`https://api.boxvlu.click/api/events/approved`)
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
    };

    return (
        <div className="">
            <div className="h-full flex items-center">
                <div className="w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gray-500 relative overflow-hidden"
                    >
                        <Slider {...sliderSettings}>
                            {data.map((event, index) => (
                                <img
                                    key={index}
                                    src={`https://api.boxvlu.click/api/images/${event.path}`}
                                    alt={event.title}
                                    className="h-full w-full object-cover"
                                />
                            ))}
                        </Slider>
                        <div className=" absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
                            <div class="flex justify-center items-center h-full">
                                <div className="text-center text-white px-6 md:px-12">
                                    <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">
                                        Tham gia sự kiện  <br /><span>Cùng chúng tôi</span>
                                    </h1>
                                    <button type="button" className="inline-block px-7 py-3 border-2 border-white text-white font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light">
                                        Bắt đầu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
