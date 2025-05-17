import { useEffect, useState } from "react";
import {
  getAllGenders,
  getAllUsers,
  updateUser,
} from "../../../service/http/userServices";
import type { UserInterface } from "../../../interface/IUser";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../assets/avartar.svg";
import "./Edit.css";
import { message, Spin } from "antd";
import type { GenderInterface } from "../../../interface/IGender";

export default function EditUserPage() {
  const [form, setForm] = useState<Partial<UserInterface>>({});
  const [userId, setUserId] = useState<number | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [genders, setGenders] = useState<GenderInterface[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const users = await getAllUsers();
      const allGenders = await getAllGenders();
      setGenders(allGenders);
      const email = localStorage.getItem("userEmail");
      const user = users.find((u) => u.email === email);
      if (user) {
        setForm(user);
        setUserId(user.id ?? null);
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
    console.log("from", form);
  };

  const handleSubmit = async () => {
    if (!userId) return;

    const nameRegex = /^[a-zA-Z\s]{2,100}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const phoneRegex = /^\d{10}$/;

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone_number
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    if (!nameRegex.test(form.first_name) || !nameRegex.test(form.last_name)) {
      message.warning(
        "First and Last Name must be only letters and 2–100 characters."
      );
      return;
    }

    if (!emailRegex.test(form.email)) {
      message.error("Invalid email format.");
      return;
    }

    if (!phoneRegex.test(form.phone_number)) {
      message.error("Phone number must be 10 digits.");
      return;
    }

    if (newPassword || repeatPassword || oldPassword) {
      if (!oldPassword || !newPassword || !repeatPassword) {
        message.error("Please fill all password fields.");
        return;
      }

      if (!passwordRegex.test(newPassword)) {
        message.error(
          "New password must contain letters and numbers and be at least 6 characters."
        );
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
            name="first_name"
            placeholder="First Name"
            value={form.first_name || ""}
            onChange={handleChange}
          />
          <input
            name="last_name"
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
          name="phone_number"
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
          {genders.map((g) => (
            <option key={g.id} value={g.id}>
              {g.gender}
            </option>
          ))}
        </select>

        <button className="edit-button" onClick={handleSubmit}>
          Confirm
        </button>
        <button className="cancel-button" onClick={() => navigate("/info")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
