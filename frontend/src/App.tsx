import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/user/home/index";
import InfoPage from "./pages/user/info/index";
import EditPage from "./pages/user/edit/index";
import LoginPage from "./pages/user/login/index";
import RegisterPage from "./pages/user/register/index";

import AppointmentPage from "./pages/appointment/Appointment";
import MyAppointmentsPage from "./pages/appointment/MyAppointments";
import DoctorAppointmentPage from "./pages/DoctorAppointmentPage";
import AddDoctor from "./pages/AddDoctor";
import DoctorList from "./pages/DoctorList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/doctor" element={<DoctorAppointmentPage />} />
          <Route path="/adddoctor" element={<AddDoctor />} />
          <Route path="/doctorlist" element={<DoctorList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
