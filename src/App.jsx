// src/App.js
import React from 'react';
import CalendarComponent from './components/Calendar';
import RoomBooking from './components/RoomBooking';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-600 text-white p-4 text-center text-3xl font-bold">
        Hotel Management System
      </header>
      <div className="flex flex-col lg:flex-row lg:space-x-4 p-4">
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
          <CalendarComponent />
        </div>
        <div className="w-full lg:w-1/2">
          <RoomBooking />
        </div>
      </div>
    </div>
  );
}

export default App;
