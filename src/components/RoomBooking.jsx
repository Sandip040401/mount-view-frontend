// src/components/RoomBooking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomBooking = () => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookedRooms, setBookedRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(17); // Total number of rooms in your hotel
  const [numberOfRooms, setNumberOfRooms] = useState(1); // Default to booking 1 room
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BASE_URL;

  // Fetch available rooms count for the selected date
  const fetchRoomAvailability = async () => {
    try {
      setLoading(true);
      if (bookingDate) {
        const response = await axios.get(`${backendUrl}/api/rooms/availability/${bookingDate}`);
        setBookedRooms(response.data.bookedRooms);
        setAvailableRooms(response.data.availableRooms);
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
      setBookedRooms(0);
      setAvailableRooms(17); // Reset to total rooms on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomAvailability();
  }, [bookingDate]);

  const handleBookRooms = async () => {
    try {
      setBookingLoading(true);
      await axios.post(`${backendUrl}/api/rooms/book`, {
        date: new Date(bookingDate),
        numberOfRooms: parseInt(numberOfRooms),
      });
      setMessage(`Rooms booked successfully.`);
      setBookingDate(''); // Clear the booking date input
      setNumberOfRooms(1); // Reset the number of rooms to 1
      fetchRoomAvailability(); // Fetch the updated room availability
    } catch (error) {
      console.error('Error booking rooms:', error);
      setMessage('Error booking rooms. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center">Room Booking</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">Date:</span>
          <input
            type="date"
            className="border p-2 rounded-lg flex-1"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-center mt-4">Loading room availability...</p>
        ) : (
          bookingDate && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-lg">Booked Rooms: <span className="font-medium">{bookedRooms}</span></p>
                <p className="text-lg">Available Rooms: <span className="font-medium">{availableRooms}</span></p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Number of Rooms:</span>
                <input
                  type="number"
                  className="border p-2 rounded-lg w-20"
                  value={numberOfRooms}
                  min={1}
                  max={availableRooms}
                  onChange={(e) => setNumberOfRooms(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 ${bookingLoading ? 'cursor-not-allowed' : ''}`}
                  onClick={handleBookRooms}
                  disabled={availableRooms === 0 || numberOfRooms < 1 || bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Book Rooms'}
                </button>
              </div>
            </>
          )
        )}
        {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default RoomBooking;
