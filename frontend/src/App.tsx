//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppointmentPage from "./pages/Appointment";
import MyAppointmentsPage from "./pages/MyAppointments";
import DoctorAppointmentPage from "./pages/DoctorAppointmentPage";
import AddDoctor from "./pages/AddDoctor";
import DoctorList from "./pages/DoctorList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/doctor" element={<DoctorAppointmentPage />} />
          <Route path="/adddoctor" element={<AddDoctor />} />
          <Route path="/doctorlist" element={<DoctorList />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
