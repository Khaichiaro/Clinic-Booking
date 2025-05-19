import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo3 from "../../assets/logo3.svg";
import UserIcon from "../../assets/user1.svg"; // เพิ่มไอคอนคน

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="nav-logo-group">
        <img src={logo3} alt="logo" className="nav-logo" />
        <span className="clinic-name">DENTAL CLINIC</span>
      </div>

      <div className="nav-right">
        {token && (
          <img
            src={UserIcon}
            alt="user"
            className="nav-user-icon"
            onClick={() => navigate("/info")} // เพิ่มให้คลิกได้
          />
        )}
        <button
          className="nav-button"
          onClick={() => {
            if (token) handleLogout();
            else navigate("/login");
          }}
        >
          {token ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
}
