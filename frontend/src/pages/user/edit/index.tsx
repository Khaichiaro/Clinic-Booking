import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../../../service/http/userServices";
import type { UserInterface } from "../../../interface/IUser";
import { useNavigate } from "react-router-dom";
import "./Edit.css";

export default function EditUserPage() {
  const [form, setForm] = useState<Partial<UserInterface>>({});
  const [userId, setUserId] = useState<number | null>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const users = await getAllUsers();
      const email = localStorage.getItem("userEmail");
      const user = users.find(u => u.email === email);
      if (user) {
        setForm(user);
        setUserId(user.id);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (userId) {
      await updateUser(userId, form);
      navigate("/user/info");
    }
  };

  return (
    <div className="edit-page">
      <h2>Edit Info</h2>
      <input name="firstname" value={form.firstname || ""} onChange={handleChange} />
      <input name="lastname" value={form.lastname || ""} onChange={handleChange} />
      <input name="email" value={form.email || ""} onChange={handleChange} />
      <input name="password" type="password" value={form.password || ""} onChange={handleChange} />
      <input name="phonenumber" value={form.phonenumber || ""} onChange={handleChange} />
      <select name="gender" value={form.gender_id || ""} onChange={handleChange}>
        <option value="1">Male</option>
        <option value="2">Female</option>
        <option value="3">LGBTQ+</option>
      </select>
      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
}
