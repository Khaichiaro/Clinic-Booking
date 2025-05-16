import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo3 from "../../../assets/logo3.svg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [id] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("userId", id);
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={Logo3} alt="logo" />
        <h2>Booking Clinic</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
