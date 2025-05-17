import React, { useState } from "react";
import "./AddDoctor.css";
import doca from "../../assets/doca.png";

const AddDoctor: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    // ตัวอย่าง: แสดงข้อมูลตอนกด add
    alert(JSON.stringify(form, null, 2));
    // TODO: เพิ่ม logic ส่งข้อมูล server หรืออื่นๆ
  };

  return (
    <div className="adddoc">
      <div className="container">
        <div className="image-side">
          <img src={doca} alt="Doctor" />
        </div>
        <div className="form-side">
          <h2>DOCTOR</h2>
          <div className="row">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group full-width">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="input-group full-width">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className="add-button" onClick={handleAdd}>
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
