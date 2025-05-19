import React, { useState, useEffect } from "react";
import "./AddDoctor.css";
import doca from "../../assets/doca.png";
import type { GenderInterface } from "../../interface/IGender";
import { createDoctor, getAllGenders } from "../../service/http/doctor";
import type { DoctorInterface } from "../../interface/IDoctor";
import { useNavigate } from "react-router-dom";

const AddDoctor: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    gender: "",
  });

  const [genders, setGenders] = useState<GenderInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllGenders();
        setGenders(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load genders:", err);
        setError(err.message || "Failed to load genders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const newDoctor: DoctorInterface = {
      first_name: form.firstName,
      last_name: form.lastName,
      phone_number: form.phoneNumber,
      email: form.email,
      password: form.password,
      gender_id: Number(form.gender),
    };

    try {
      const res = await createDoctor(newDoctor);
      alert("Created doctor successfully!");
      navigate("/doctorlist");
      console.log(res);
    } catch (err: any) {
      console.error("Failed to create doctor:", err);
      alert("Failed to create doctor: " + (err.message || "Unknown error"));
    }
  };

  if (loading) return <p>Loading genders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
                {genders.map((g) => (
                  <option key={g.gender} value={g.id}>
                    {g.gender}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button className="back-button" onClick={() => navigate("/doctorlist")}>
              CANCLE
            </button>
            <button className="add-button" onClick={handleAdd}>
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
