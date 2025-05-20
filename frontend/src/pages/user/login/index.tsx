import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../service/http/userServices";
import { getDoctors } from "../../../service/http/doctor"; // เพิ่มการนำเข้า getDoctors
import Logo3 from "../../../assets/logo3.svg";
import { message, Spin } from "antd";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay แสดงผล 0.5 วิ
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Spin size="large" />
      </div>
    );
  }

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Please enter email and password");
      return;
    }

    try {
      // ดึงข้อมูลผู้ใช้ทั่วไป
      const users = await getAllUsers();
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );
      
      // ดึงข้อมูลหมอ
      const doctors = await getDoctors();
      const doctor = doctors.find(
        (d: any) => d.email === email && d.password === password
      );

      // หากพบผู้ใช้ทั่วไป
      if (user) {
        if (user?.id !== undefined) {
          localStorage.setItem("userId", user.id.toString());
        } else {
          console.error("User ID is undefined");
        }
        if (user?.email !== undefined) {
          localStorage.setItem("userEmail", user.email.toString());
        } else {
          console.error("User email is undefined");
        }

        message.success("Login successful");

        // เช็คว่าเป็นหมอหรือไม่
        if (doctor) {
          if (doctor?.id !== undefined) {
            localStorage.setItem("doctorId", doctor.id.toString());
            navigate("/doctor");
          } else {
            console.error("Doctor ID is undefined");
          }
        } else {
          // หากไม่พบหมอ ให้ไปที่หน้าอื่น ๆ
          navigate("/");
        }
      } else if (doctor) {
        // หากเป็นหมอและไม่พบผู้ใช้ทั่วไป
        if (doctor?.id !== undefined) {
          localStorage.setItem("doctorId", doctor.id.toString());
          navigate("/doctor");
        } else {
          console.error("Doctor ID is undefined");
        }
      } else {
        // หากไม่พบผู้ใช้ทั่วไปหรือหมอ
        message.error("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      message.error("Login failed, please try again");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={Logo3} alt="logo" />
        <h2>Booking Clinic</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p style={{ marginTop: "10%" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
