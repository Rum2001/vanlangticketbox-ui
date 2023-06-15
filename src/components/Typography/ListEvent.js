import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ListEvent() {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  console.log(selectedCategory)

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  async function fetchEvents() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events');
      const eventsData = response.data;
      setEvents(eventsData);
      setOriginalEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChangeKeyword(event) {
    setSearchKeyword(event.target.value);
  }

  function handleChangeCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function filterEvents() {
    let filteredEvents = [...originalEvents];

    if (searchKeyword) {
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredEvents = filteredEvents.filter(   
        (event) => event.categories === selectedCategory
      );
    }

    return filteredEvents;
  }

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-4xl text-center font-bold tracking-tight text-red-600">
            Danh sách sự kiện
          </h2>
          <div className="flex justify-between items-center">
            <div className="mt-6 mb-6">
              <input
                type="text"
                name="search"
                id="search"
                value={searchKeyword}
                onChange={handleChangeKeyword}
                className="mt-1 p-1 border border-gray-300 rounded-md"
                placeholder="Tìm kiếm sự kiện"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Danh mục:
              </label>
              <select
                name="categories"
                id="categories"
                value={selectedCategory}
                onChange={handleChangeCategory}
                className="mt-1 p-1 border border-gray-300 rounded-md"
              >
                <option value="">Tất cả</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select> 
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
            {filterEvents().map((item) => (
              <Link to={`/event/${item.id}`} className="group relative" key={item.id}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={`http://127.0.0.1:8000/api/images/${item.path}`}
                    alt="Front of men's Basic Tee in black."
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Danh mục: {item.categories}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Số vé còn lại: {item.quantity_ticket}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListEvent;
