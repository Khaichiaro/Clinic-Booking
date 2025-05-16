import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo3 from "../../assets/logo3.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <img src={logo3} alt="logo" className="nav-logo" />
      <button className="nav-button" onClick={() => {
        if (token) handleLogout();
        else navigate("/login");
      }}>
        {token ? "Logout" : "Login"}
      </button>
    </div>
  );
}
