import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import "./Home.css";

import User1 from "../../../assets/user1.svg";
import Calendar from "../../../assets/calendar.svg";
import Doctor1 from "../../../assets/doctor1.svg";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userId");
  console.log("userId", token);

  const isLoggedIn = !!token;

  return (
    <div>
      <Navbar />

      {!isLoggedIn && (
        <div className="home-warning">
          <p>Please login first to access features.</p>
        </div>
      )}

      <div className={`home-container ${!isLoggedIn ? "disabled" : ""}`}>
        <div className="card light" onClick={() => isLoggedIn && navigate("/info")}>
          <img src={User1} alt="user" />
          <div>Your info</div>
        </div>

        <div className="card purple" onClick={() => isLoggedIn && navigate("/my-appointments")}>
          <img src={Calendar} alt="calendar" />
          <div>Appointment</div>
        </div>

        <div className="card dark" onClick={() => isLoggedIn && navigate("/doctorlist")}>
          <img src={Doctor1} alt="doctor" />
          <div>Doctor</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
