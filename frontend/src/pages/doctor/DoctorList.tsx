import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import idoc from "../../assets/idoc.png";
import "./DoctorList.css";
import type { DoctorInterface } from "../../interface/IDoctor";
import { getDoctors } from "../../service/http/doctor";

const DoctorList: React.FC = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  (async () => {
    try {
      const data = await getDoctors();
      console.log("getDoctors data:", data);

      if (Array.isArray(data)) {
        setDoctors(data);
        setError(null);
      } else {
        throw new Error("Data format invalid: expected an array");
      }
    } catch (err: any) {
      console.error("Failed to fetch doctors:", err);
      setDoctors([]);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const handleNewDoctorClick = () => {
    navigate("/adddoctor");
  };

  return (
    <div className="dl">
      <div className="doctor-list-container">
        <div className="header">
          <img src={idoc} alt="Doctor Icon" className="doctor-icon" />
          <h2>ALL DOCTOR</h2>
        </div>

        {loading ? (
          <p>Loading doctors...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <table className="doctor-table">
            <thead>
              <tr>
                <th>id</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Phonenumber</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 1 ? "striped" : ""}>
                    <td>{doc.id}</td>
                    <td>{doc.first_name}</td>
                    <td>{doc.last_name}</td>
                    <td>{doc.phone_number}</td>
                    <td>{doc.email}</td>
                    <td className="menu">⋮</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button className="back-button" onClick={() => navigate("/doctor")}>
              BACK
            </button>
        <button className="new-doctor-btn" onClick={handleNewDoctorClick}>
          NEW DOCTOR
        </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
