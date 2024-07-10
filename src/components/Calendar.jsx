// src/components/Calendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [totalRooms] = useState(17); // Total number of rooms
  const [editedData, setEditedData] = useState({}); // State to store temporarily edited data
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({}); // State to manage loading state for individual updates

  const backendUrl = import.meta.env.VITE_BASE_URL;

  // Function to fetch data based on selected month and year
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/rooms/data?month=${month}&year=${year}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to update booked rooms for a specific date
  const handleUpdateRooms = async (date, bookedRooms) => {
    try {
      if (bookedRooms > totalRooms) {
        alert(`Number of booked rooms cannot exceed ${totalRooms}.`);
        return;
      }

      setUpdating(prev => ({ ...prev, [date]: true }));

      const response = await axios.post(`${backendUrl}/api/rooms/booking`, { date, numberOfRooms: bookedRooms });
      const updatedData = data.map(item => {
        if (item.date === date) {
          return { ...item, bookedRooms: response.data.bookedRooms, availableRooms: response.data.availableRooms };
        }
        return item;
      });
      setData(updatedData);
    } catch (error) {
      console.error('Error updating rooms:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [date]: false }));
    }
  };

  // Handle edit button click
  const handleEditClick = (date, bookedRooms) => {
    setEditedData({ ...editedData, [date]: bookedRooms });
  };

  // Handle save button click
  const handleSaveClick = async (date) => {
    if (editedData[date] === undefined) {
      return;
    }

    const newBookedRooms = editedData[date];
    await handleUpdateRooms(date, newBookedRooms);
    setEditedData({ ...editedData, [date]: undefined });
  };

  // Effect to fetch data whenever month or year changes
  useEffect(() => {
    if (month && year) {
      handleFetchData();
    }
  }, [month, year]);


  // Generate options for months (January to December)
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const monthName = new Date(2021, index).toLocaleString('default', { month: 'long' });
    return <option key={monthNumber} value={monthNumber}>{monthName}</option>;
  });

  // Generate options for years (from 2023 to 2030)
  const yearOptions = Array.from({ length: 8 }, (_, index) => {
    const yearNumber = 2023 + index;
    return <option key={yearNumber} value={yearNumber}>{yearNumber}</option>;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center">Monthly Table</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <select
          className="border rounded-lg p-2 mb-4 sm:mb-0 w-full sm:w-auto"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          {monthOptions}
        </select>
        <select
          className="border rounded-lg p-2 w-full sm:w-auto"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {yearOptions}
        </select>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center mt-4">Loading data...</p>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-blue-200 text-gray-700">
                <th className="border p-4">#</th>
                <th className="border p-4">Date</th>
                <th className="border p-4">Booked Rooms</th>
                <th className="border p-4">Available Rooms</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="border p-4 text-center">{index + 1}</td>
                  <td className="border p-4 text-center">{item.date}</td>
                  <td className="border p-4 text-center">
                    {editedData[item.date] !== undefined ? (
                      <input
                        type="number"
                        className="border rounded-lg p-2 w-full"
                        value={editedData[item.date]}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setEditedData({ ...editedData, [item.date]: newValue });
                        }}
                      />
                    ) : (
                      item.bookedRooms
                    )}
                  </td>
                  <td className="border p-4 text-center">{totalRooms - item.bookedRooms}</td>
                  <td className="border p-4 text-center">
                    {editedData[item.date] !== undefined ? (
                      <button
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mr-2 ${updating[item.date] ? 'cursor-not-allowed' : ''}`}
                        onClick={() => handleSaveClick(item.date)}
                        disabled={updating[item.date]}
                      >
                        {updating[item.date] ? 'Saving...' : 'Save'}
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                        onClick={() => handleEditClick(item.date, item.bookedRooms)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Calendar;
