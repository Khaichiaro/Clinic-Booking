import React from "react";
import { useNavigate } from "react-router-dom";  // <-- นำเข้า useNavigate
import idoc from "../assets/idoc.png";
import "./DoctorList.css";

type Doctor = {
  id: number;
  firstname: string;
  lastname: string;
  phonenum: string;
  email: string;
};

const doctors: Doctor[] = [
  { id: 1, firstname: "Dr. Deejaa", lastname: "Annnnnn", phonenum: "0123456789", email: "a@gmail.com" },
  { id: 2, firstname: "Dr. Jpannn", lastname: "Nannnnn", phonenum: "0987456321", email: "a@gmail.com" },
  { id: 3, firstname: "Dr. Harry", lastname: "Chianggggg", phonenum: "0214559789", email: "a@gmail.com" },
  { id: 4, firstname: "Dr. Herchy", lastname: "Bankkkkkk", phonenum: "0874562856", email: "a@gmail.com" },
];

const DoctorList: React.FC = () => {
  const navigate = useNavigate();  // <-- เรียกใช้ useNavigate

  const handleNewDoctorClick = () => {
    navigate("/adddoctor");  // <-- เปลี่ยน path ให้ตรงกับ route หน้า AddDoctor ของคุณ
  };

  return (
    <div className="dl">
      <div className="doctor-list-container">
        <div className="header">
          <img src={idoc} alt="Doctor Icon" className="doctor-icon" />
          <h2>ALL DOCTOR</h2>
        </div>

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
            {doctors.map((doc, idx) => (
              <tr key={doc.id} className={idx % 2 === 1 ? "striped" : ""}>
                <td>{doc.id}</td>
                <td>{doc.firstname}</td>
                <td>{doc.lastname}</td>
                <td>{doc.phonenum}</td>
                <td>
                  <a href={`mailto:${doc.email}`} className="link">
                    {doc.email}
                  </a>
                </td>
                <td className="menu">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="new-doctor-btn" onClick={handleNewDoctorClick}>New Doctor</button>
      </div>
    </div>
  );
};

export default DoctorList;
