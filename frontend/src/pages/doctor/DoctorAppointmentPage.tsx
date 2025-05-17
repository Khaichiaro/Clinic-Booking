import React, { useState } from "react";
import styles from "./DoctorAppointmentPage.module.css";
import { useNavigate } from "react-router-dom";
import doctorImg from "../../assets/doctorg.png"; // หมอ
import pmImg from "../../assets/pm.png";         // คนไข้ชาย
import pgImg from "../../assets/pg.png";         // คนไข้หญิง

type Appointment = {
  time: string;
  name: string;
  type: string;
  avatar: "doctor" | "pm" | "pg";
  bgColor: string;
};

const appointmentsData: Record<string, Appointment[]> = {
  "2025-08-16": [
    { time: "12:00 PM", name: "Anant Momod", type: "จัดฟัน", avatar: "pm", bgColor: "#CBC9F7" },
    { time: "2:00 PM", name: "Momo Paradise", type: "จัดฟัน", avatar: "pg", bgColor: "#C4F7FF" },
  ],
  "2025-08-17": [
    { time: "2:00 PM", name: "Anant Momod", type: "ถอนฟัน", avatar: "pm", bgColor: "#CBC9F7" },
    { time: "8:00 PM", name: "Momo Paradise", type: "ขูดหินปูน", avatar: "pg", bgColor: "#C4F7FF" },
  ],
};

const dates = [
  { day: 15, month: "AUG", full: "2025-08-15" },
  { day: 16, month: "AUG", full: "2025-08-16" },
  { day: 17, month: "AUG", full: "2025-08-17" },
  { day: 18, month: "AUG", full: "2025-08-18" },
];

const DoctorAppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dates[1].full);
  const navigate = useNavigate();
  
  const getAvatarImg = (avatar: "doctor" | "pm" | "pg") => {
    switch (avatar) {
      case "doctor":
        return doctorImg;
      case "pm":
        return pmImg;
      case "pg":
        return pgImg;
      default:
        return pmImg;
    }
  };

  const goToDoctorList = () => {
    navigate("/doctorlist");
  };

  return (
    <div className={styles.container}>
      {/* Left Card */}
      <div className={styles.leftCard}>
        <img src={doctorImg} alt="หมอ" className={styles.doctorImage} />
        <h2 className={styles.doctorName}>
          Dr. Stellar&nbsp;&nbsp;&nbsp;&nbsp;Universe
        </h2>
        <p className={styles.contactText}>0885564471</p>
        <p className={styles.contactText}>stellar@doctor.com</p>
        <div className={styles.buttonGroup}>
          <button className={styles.btn} onClick={goToDoctorList}>DOCTOR</button>
          <button className={styles.btn}>PATIENT</button>
        </div>
      </div>

      {/* Right Card */}
      <div className={styles.rightCard}>
        <h3 className={styles.title}>August 2025</h3>
        <div className={styles.dateSelector}>
          <button
            className={styles.arrowBtn}
            onClick={() => {
              const idx = dates.findIndex((d) => d.full === selectedDate);
              if (idx > 0) setSelectedDate(dates[idx - 1].full);
            }}
          >
            &lt;
          </button>
          {dates.map(({ day, month, full }) => (
            <div
              key={full}
              onClick={() => setSelectedDate(full)}
              className={`${styles.dateBox} ${full === selectedDate ? styles.dateBoxActive : ""}`}
            >
              <div className={styles.dayText}>{day}</div>
              <div className={styles.monthText}>{month}</div>
            </div>
          ))}
          <button
            className={styles.arrowBtn}
            onClick={() => {
              const idx = dates.findIndex((d) => d.full === selectedDate);
              if (idx < dates.length - 1) setSelectedDate(dates[idx + 1].full);
            }}
          >
            &gt;
          </button>
        </div>

        <p className={styles.upcomingText}>Upcoming Appointment</p>

        {appointmentsData[selectedDate]?.map((app, idx) => (
          <div
            key={idx}
            className={styles.appointmentCard}
            style={{ backgroundColor: app.bgColor }}
          >
            <div className={styles.appointmentTime}>{app.time}</div>
            <div className={styles.appointmentInfo}>
              <img
                src={getAvatarImg(app.avatar)}
                alt="avatar"
                className={styles.avatarImg}
              />
              <div>
                <div className={styles.patientName}>{app.name}</div>
                <div className={styles.treatmentType}>{app.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointmentPage;
