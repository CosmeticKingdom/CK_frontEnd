import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Service from '../pages/Service';
import Reservation from '../pages/Reservation';
import Expert from '../pages/Expert';
import Inquiry from '../pages/Inquiry';
import MyReservations from '../pages/MyReservations';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/service" element={<Service />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/expert" element={<Expert />} />
      <Route path="/inquiry" element={<Inquiry />} />
      <Route path="/my-reservations" element={<MyReservations />} />
    </Routes>
  );
}