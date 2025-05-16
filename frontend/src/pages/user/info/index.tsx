import { useEffect, useState } from "react";
import { getAllUsers } from "../../../service/http/userServices";
import type { UserInterface } from "../../../interface/IUser";
import "./Info.css";
import Avatar from "../../../assets/avartar.svg";
import { useNavigate } from "react-router-dom";

export default function InfoPage() {
  const [user, setUser] = useState<UserInterface | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allUsers = await getAllUsers();
      const userId = localStorage.getItem("userId");
      const currentUser = allUsers.find(u => String(u.id) === userId);
      console.log("currentUser", currentUser);
      if (currentUser) setUser(currentUser);
    })();
  }, []);

  return user ? (
    <div className="info-container">
      <div className="info-card">
        <img src={Avatar} alt="avatar" />
        <h2>{user.first_name} {user.last_name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
        <p><strong>Gender:</strong> {user.gender_id === 1 ? "Male" : user.gender_id === 2 ? "Female" : "LGBTQ+"}</p>
        <button className="info-button" onClick={() => navigate("/edit")}>Edit Info</button>
        <button className="info-back-button" onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  ) : (
    <div className="info-container">
      <p>Loading...</p>
    </div>
  );
}
