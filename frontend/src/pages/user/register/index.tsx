import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../../service/http/userServices";
import Logo3 from "../../../assets/logo3.svg";
import { useState } from "react";

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

  const handleRegister = async () => {
    if (form.password === form.confirmPassword) {
      const userToCreate = {
        firstname: form.first_name,
        lastname: form.last_name,
        email: form.email,
        password: form.password,
        phonenumber: form.phone,
        gender_id: Number(form.gender), // แปลงเป็น number
      };

      await createUser(userToCreate); // ส่ง object ที่ตรงกับ UserInterface
      console.log(userToCreate);
      localStorage.setItem("token", "mock-token");
      navigate("/");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={Logo3} alt="logo" />
        <h2>Register</h2>
        <input
          placeholder="First Name"
          name="first_name"
          onChange={handleChange}
        />
        <input
          placeholder="Last Name"
          name="last_name"
          onChange={handleChange}
        />
        <input placeholder="Email" name="email" onChange={handleChange} />
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <input
          placeholder="Repeat Password"
          type="password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <input placeholder="Phone" name="phone" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option>Gender</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
        <button onClick={handleRegister}>Create Account</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
