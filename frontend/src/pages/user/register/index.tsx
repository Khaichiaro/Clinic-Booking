import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { createUser, getAllGenders } from "../../../service/http/userServices";
import Logo3 from "../../../assets/logo3.svg";
import { useEffect, useState } from "react";
import { message, Spin } from "antd";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [genders, setGenders] = useState<{ id: number; gender: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    weight: "",
    height: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllGenders();
        setGenders(res);
      } catch (e) {
        message.error("Failed to load genders.");
      }
      setTimeout(() => {
        setLoading(false);
      }, 800);
    })();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Spin size="large" />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = (name: string) => /^[a-zA-Z\s]{2,100}$/.test(name);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const phoneRegex = /^\d{10}$/;
  const ageRegex = /^(?:0[1-9]|[1-9][0-9]|1[01][0-9]|120)$/;
  const heightRegex = /^(?:[1-9]\d(?:\.\d+)?|1\d{2}(?:\.\d+)?|2[0-4]\d(?:\.\d+)?|250(?:\.0+)?)$/;
  const weightRegex = /^(?:[1-9](?:\.\d+)?|[1-9]\d(?:\.\d+)?|1\d{2}(?:\.\d+)?|2\d{2}(?:\.\d+)?|300(?:\.0+)?)$/;


  const handleRegister = async () => {
    const {
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
      phone,
      weight,
      height,
      age,
      gender,
    } = form;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !weight ||
      !height ||
      !age ||
      !gender
    ) {
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
    
    if (!passwordRegex.test(password)) {
      message.warning(
        "Password must contain letters and numbers and be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      message.warning("Phone number must be exactly 10 digits.");
      return;
    }

    if (!ageRegex.test(age)) {
      message.warning("Age must be between 0 and 120.");
      return;
    }

    if (!heightRegex.test(height)) {
      message.warning("Height must be between 1.0 and 250.9.");
      return;
    }

    if (!weightRegex.test(weight)) {
      message.warning("Weight must be between 1.0 and 300.9.");
      return;
    }

    const userToCreate = {
      first_name,
      last_name,
      email,
      password,
      phone_number: phone,
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
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
        <div className="name-row">
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
        </div>
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
        <input placeholder="Age" name="age" onChange={handleChange} />
        <input placeholder="Weight" name="weight" onChange={handleChange} />
        <input placeholder="Height" name="height" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="">-- Select Gender --</option>
          {genders.map((g) => (
            <option key={g.id} value={g.id}>
              {g.gender}
            </option>
          ))}
        </select>
        <button className="register-button" onClick={handleRegister}>
          Create Account
        </button>
        <p style={{ marginTop: "10%" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
