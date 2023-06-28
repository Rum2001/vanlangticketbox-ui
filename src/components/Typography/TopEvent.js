import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TopEvent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://api.boxvlu.click/api/events/approved`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className='px-6 py-12 mx-auto min-h-min'>
            <h2 className="text-3xl font-bold mb-12 text-center text-red-600">
                Sự Kiện Hàng Đầu
            </h2>

            <Slider className="grid lg:grid-cols-3 gap-2"
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={2000}
                responsive={[
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                        },
                    },
                ]}
            >
                {data.map((event, index) => (
                    <div key={index} className=" px-2 zoom shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover h-[15rem]" style={{ backgroundPosition: '50%' }} data-mdb-ripple="true" data-mdb-ripple-color="dark">
                        <img src={`https://api.boxvlu.click/api/images/${event.path}`} className="w-full max-h-full object-cover transition duration-300 ease-linear align-middle" alt={event.name} />
                        <Link to={`/event/${event.id}`}>
                            <div className="mx-2 absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                <div className="flex justify-start items-end h-full">
                                    <h5 className="text-lg font-bold text-white m-6">{event.title}</h5>
                                </div>
                            </div>
                            <div className="hover-overlay">
                                <div className="mask absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100" style={{ backgroundColor: 'rgba(253, 253, 253, 0.15)' }} />
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TopEvent;
