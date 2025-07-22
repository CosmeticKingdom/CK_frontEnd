import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import Service from '../pages/Service';
import Reservation from '../pages/Reservation';
import Expert from '../pages/Expert';
import Inquiry from '../pages/Inquiry';
import MyReservations from '../pages/MyReservations';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { showLoginModal } = useAuth();
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    showLoginModal();
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/service" element={<Service />} />
      <Route element={<PrivateRoute />}>
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/my-reservations" element={<MyReservations />} />
      </Route>
      <Route path="/expert" element={<Expert />} />
      <Route path="/inquiry" element={<Inquiry />} />
    </Routes>
  );
}