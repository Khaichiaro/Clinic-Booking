import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../../../service/http/userServices";
import type { UserInterface } from "../../../interface/IUser";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../assets/avartar.svg";
import "./Edit.css";
import { message } from "antd";

export default function EditUserPage() {
  const [form, setForm] = useState<Partial<UserInterface>>({});
  const [userId, setUserId] = useState<number | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const users = await getAllUsers();
      const email = localStorage.getItem("userEmail");
      const user = users.find((u) => u.email === email);
      if (user) {
        setForm(user);
        setUserId(user.id ?? null);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) return;

    if (!form.first_name || !form.last_name || !form.email || !form.phone_number) {
      message.error("Please fill in all required fields.");
      return;
    }

    // เช็คเบื้องต้นว่าอีเมลมีรูปแบบถูกต้อง
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      message.error("Please enter a valid email.");
      return;
    }

    if (newPassword || repeatPassword || oldPassword) {
      if (!oldPassword || !newPassword || !repeatPassword) {
        message.error("Please fill all password fields.");
        return;
      }

      if (newPassword.length < 6) {
        message.error("New password must be at least 6 characters.");
        return;
      }

      if (newPassword !== repeatPassword) {
        message.error("New passwords do not match.");
        return;
      }

      if (form.password !== oldPassword) {
        message.error("Old password is incorrect.");
        return;
      }
    }

    if (!form.gender_id) {
      message.error("Please select gender.");
      return;
    }

    const updatedUser = {
      ...form,
      password: newPassword ? newPassword : form.password,
    };

    try {
      await updateUser(userId, updatedUser);
      message.success("User info updated successfully");
      navigate("/info");
    } catch (error) {
      console.error(error);
      message.error("Failed to update user");
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <img src={Avatar} alt="avatar" />
        <h2>Edit Information</h2>

        <div className="name-row">
          <input
            name="firstname"
            placeholder="First Name"
            value={form.first_name || ""}
            onChange={handleChange}
          />
          <input
            name="lastname"
            placeholder="Last Name"
            value={form.last_name || ""}
            onChange={handleChange}
          />
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleChange}
        />

        <input
          placeholder="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          placeholder="Repeat New Password"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <input
          name="phonenumber"
          placeholder="Phone Number"
          value={form.phone_number || ""}
          onChange={handleChange}
        />

        <select
          name="gender_id"
          value={form.gender_id || ""}
          onChange={handleChange}
        >
          <option value="">-- Select Gender --</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
          <option value="3">LGBTQ+</option>
        </select>

        <button className="edit-button" onClick={handleSubmit}>Confirm</button>
        <button className="cancel-button" onClick={() => navigate("/info")}>Cancel</button>
      </div>
    </div>
  );
}
