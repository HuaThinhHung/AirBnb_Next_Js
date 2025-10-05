'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search data:', searchData)
    // Handle search logic here
    alert(`Searching for ${searchData.guests} guests in ${searchData.location || 'any location'} from ${searchData.checkIn} to ${searchData.checkOut}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Where
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchData.location}
              onChange={handleInputChange}
              placeholder="Search destinations"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* Check In */}
          <div className="space-y-2">
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Check in
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={searchData.checkIn}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>

          {/* Check Out */}
          <div className="space-y-2">
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Check out
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={searchData.checkOut}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Guests
            </label>
            <select
              id="guests"
              name="guests"
              value={searchData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value={1}>1 guest</option>
              <option value={2}>2 guests</option>
              <option value={3}>3 guests</option>
              <option value={4}>4 guests</option>
              <option value={5}>5 guests</option>
              <option value={6}>6+ guests</option>
            </select>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Where
            </label>
            <input
              type="text"
              id="location-mobile"
              name="location"
              value={searchData.location}
              onChange={handleInputChange}
              placeholder="Search destinations"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* Date and Guests Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Check In */}
            <div className="space-y-2">
              <label htmlFor="checkIn-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check in
              </label>
              <input
                type="date"
                id="checkIn-mobile"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>

            {/* Check Out */}
            <div className="space-y-2">
              <label htmlFor="checkOut-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check out
              </label>
              <input
                type="date"
                id="checkOut-mobile"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label htmlFor="guests-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Guests
            </label>
            <select
              id="guests-mobile"
              name="guests"
              value={searchData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value={1}>1 guest</option>
              <option value={2}>2 guests</option>
              <option value={3}>3 guests</option>
              <option value={4}>4 guests</option>
              <option value={5}>5 guests</option>
              <option value={6}>6+ guests</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}
