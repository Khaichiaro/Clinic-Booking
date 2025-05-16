import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../../service/http/userServices";
import Logo3 from "../../../assets/logo3.svg";
import { useState } from "react";
import { message } from "antd";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isNameValid = (name: string) =>
    /^[a-zA-Zก-๙\s]{2,100}$/.test(name); // รองรับไทย อังกฤษ

  const handleRegister = async () => {
    const { first_name, last_name, email, password, confirmPassword, phone, gender } = form;

    if (!first_name || !last_name || !email || !password || !confirmPassword || !phone || !gender) {
      message.warning("Please fill in all fields.");
      return;
    }

    if (!isNameValid(first_name) || !isNameValid(last_name)) {
      message.warning("Please enter a valid name (only letters).");
      return;
    }

    if (!isEmailValid(email)) {
      message.warning("Invalid email format.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const userToCreate = {
      first_name,
      last_name,
      email,
      password,
      phone_number: phone,
      gender_id: Number(gender),
    };

    try {
      await createUser(userToCreate);
      message.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
      message.error("Failed to register. Try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={Logo3} alt="logo" />
        <h2>Register</h2>
        <input placeholder="First Name" name="first_name" onChange={handleChange} />
        <input placeholder="Last Name" name="last_name" onChange={handleChange} />
        <input placeholder="Email" name="email" onChange={handleChange} />
        <input placeholder="Password" type="password" name="password" onChange={handleChange} />
        <input placeholder="Repeat Password" type="password" name="confirmPassword" onChange={handleChange} />
        <input placeholder="Phone" name="phone" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="">-- Select Gender --</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
          <option value="3">LGBTQ+</option>
        </select>
        <button className="register-button" onClick={handleRegister}>Create Account</button>
        <p style={{ marginTop: "10%" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
