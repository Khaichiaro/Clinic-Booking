//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppointmentPage from "./pages/Appointment";
import MyAppointmentsPage from "./pages/MyAppointments";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
