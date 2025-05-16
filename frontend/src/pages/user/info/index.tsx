import { useEffect, useState } from "react";
import { getAllUsers } from "../../../service/http/userServices";
import type { UserInterface } from "../../../interface/IUser";
import "./Info.css";

export default function InfoPage() {
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    (async () => {
      const allUsers = await getAllUsers();
      const email = localStorage.getItem("userEmail");
      const currentUser = allUsers.find(u => u.email === email);
      if (currentUser) setUser(currentUser);
    })();
  }, []);

  return user ? (
    <div className="info">
      <h2>{user.firstname} {user.lastname}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phonenumber}</p>
      <p><strong>Gender:</strong> {user.gender_id === 1 ? "Male" : user.gender_id === 2 ? "Female" : "LGBTQ+"}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
