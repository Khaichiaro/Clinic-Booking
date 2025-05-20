import React, { useState, useEffect, useRef } from "react";
import styles from "./DoctorAppointmentPage.module.css";
import { useNavigate } from "react-router-dom";
import { getDoctorById } from "../../service/http/doctor";
import { fetchAppointments } from "../../service/http/doctor"; // เปลี่ยน import จาก service Doctor.ts

import doctorImg from "../../assets/doctorg.png"; // หมอ (หญิง)
import doctorm from "../../assets/doctorm.png"; // หมอ (ชาย)
import pmImg from "../../assets/pm.png"; // คนไข้ชาย
import pgImg from "../../assets/pg.png"; // คนไข้หญิง
import type { AppointmentInterface } from "../../interface/IAppointment";

const DoctorAppointmentPage: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<AppointmentInterface[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  ); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const navigate = useNavigate();
  const doctorId = Number(localStorage.getItem("doctorId"));
  if (doctorId) {
    console.log("Doctor ID:", doctorId);
  } else {
    console.log("No doctorId found in localStorage");
  }

  // ref เก็บกล่องวันที่แต่ละอัน
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // โหลดข้อมูลหมอ
  useEffect(() => {
    getDoctorById(doctorId).then(setDoctor).catch(console.error);
  }, [doctorId]);

  // โหลดข้อมูลนัดทั้งหมดและกรองเฉพาะของหมอคนนี้
  useEffect(() => {
    fetchAppointments(doctorId) // ส่ง doctorId เข้าไปเลย ให้ backend กรองให้
      .then((allAppointments: AppointmentInterface[]) => {
        console.log("Appointments from API:", allAppointments);
        setAppointments(allAppointments);
      })
      .catch(console.error);
  }, [doctorId]);

  // scroll กล่องวันที่ที่เลือกเข้ามาใน view อัตโนมัติ
  useEffect(() => {
    const el = dateRefs.current[selectedDate];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  // ฟังก์ชันสร้าง array วันที่ 4 วันรอบ ๆ วันที่เลือก (2 วันก่อน, วันที่เลือก, 1 วันหลัง)
  const getNearbyDates = (baseDateStr: string) => {
    const baseDate = new Date(baseDateStr);
    const dates = [];
    for (let i = -1; i <= 2; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  // กรองนัดเฉพาะวันที่เลือก และเฉพาะ status Confirmed หรือ Completed
  const filteredAppointmentsByDate = appointments.filter(
    (app) =>
      app.appointment_date === selectedDate &&
      (app.status?.status === "Pending" || app.status?.status === "Cancelled")
  );

  // ฟังก์ชันแปลงเวลา HH:MM:SS เป็น HH:MM
  const formatTimeHM = (timeStr?: string) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  // ฟังก์ชันแสดงอิโมจิตามสถานะ
  const getStatusEmoji = (status?: string) => {
    if (status === "Pending") return "⏳"; // นาฬิกาทราย
    if (status === "Cancelled") return "❌"; // ติ๊กถูก
    return "";
  };

  // กำหนดรูปหมอตาม gender_id
  const getDoctorImage = (genderId: number) => {
    if (genderId === 1) return doctorm;
    if (genderId === 2) return doctorImg;
    return doctorm;
  };

  // กำหนดรูปคนไข้ตามเพศ (default เป็นชายถ้าไม่รู้)
  const getPatientAvatar = (genderId?: number) => {
    if (genderId === 1) return pmImg;
    if (genderId === 2) return pgImg;
    return pmImg;
  };

  // แปลงเดือนเป็นชื่อเดือน (อังกฤษ ย่อ)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const goToDoctorList = () => {
    navigate("/doctorlist");
  };

  const goToDoctorSch = () => {
    navigate("/doctorschedule");
  };

  const handleLogout = () => {
    localStorage.clear(); // หรือลบเฉพาะ key ที่ต้องการ
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {/* Left Card */}
      <div className={styles.leftCard}>
        {doctor ? (
          <>
            <img
              src={getDoctorImage(doctor.gender_id)}
              alt="หมอ"
              className={styles.doctorImage}
            />
            <h2 className={styles.doctorName}>
              {doctor.first_name} {doctor.last_name}
            </h2>
            <p className={styles.contactText}>
              Phone Number: {doctor.phone_number}
            </p>
            <p className={styles.contactText}>Email: {doctor.email}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={goToDoctorList}>
                DOCTOR
              </button>
              <button className={styles.btn} onClick={goToDoctorSch}>
                ADD SCHEDULE
              </button>
            </div>
          </>
        ) : (
          <p>Loading doctor information...</p>
        )}
      </div>

      {/* Right Card */}
      <div className={styles.rightCard}>
        <h3 className={styles.title}>
          {monthNames[new Date(selectedDate).getMonth()]}{" "}
          {new Date(selectedDate).getFullYear()}
        </h3>

        {/* ปุ่มเลื่อนวันที่ */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <button
            onClick={() => {
              // เลื่อนไปวันที่ก่อนหน้า 4 วัน
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 4);
              setSelectedDate(newDate.toISOString().slice(0, 10));
            }}
            style={{
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              background: "none",
              marginRight: 8,
            }}
            aria-label="Previous dates"
          >
            &lt;
          </button>

          {/* กล่องวันที่ 4 วัน */}
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              scrollBehavior: "smooth",
            }}
          >
            {getNearbyDates(selectedDate).map((dateObj) => {
              const dateStr = dateObj.toISOString().slice(0, 10);
              const day = dateObj.getDate();
              const isSelected = dateStr === selectedDate;
              return (
                <div
                  key={dateStr}
                  ref={(el) => (dateRefs.current[dateStr] = el)} // เก็บ ref
                  className={
                    isSelected ? styles.selectedDateBox : styles.dateBox
                  }
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: isSelected ? "none" : "1.5px solid #344054",
                    backgroundColor: isSelected ? "#203864" : "white",
                    color: isSelected ? "white" : "#344054",
                    fontWeight: "bold",
                    textAlign: "center",
                    minWidth: 52,
                    userSelect: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: 14, lineHeight: 1 }}>{day}</div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {monthNames[dateObj.getMonth()]}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              // เลื่อนไปวันที่ถัดไป 4 วัน
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 4);
              setSelectedDate(newDate.toISOString().slice(0, 10));
            }}
            style={{
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              background: "none",
              marginLeft: 8,
            }}
            aria-label="Next dates"
          >
            &gt;
          </button>
        </div>

        <h4 style={{ marginBottom: 8 }}>Upcoming Appointment</h4>
        {filteredAppointmentsByDate.length === 0 && <p>No appointments</p>}
        {filteredAppointmentsByDate.map((app) => (
          <div
            key={app.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 12,
              backgroundColor:
                app.user?.gender_id === 1 ? "#C6E2FF" : "#DDDFFF",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginRight: 16,
                minWidth: 80,
                fontSize: 14,
                color: "#203864",
              }}
            >
              {formatTimeHM(app.appointment_time)}
            </div>
            <img
              src={getPatientAvatar(app.user?.gender_id)}
              alt="patient"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 12,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#000",
                  marginBottom: 2,
                }}
              >
                {app.user?.first_name ?? "Unknown"} {app.user?.last_name ?? ""}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#344054",
                  marginBottom: 2,
                }}
              >
                {typeof app.service_name === "string" ? app.service_name : ""}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#7f8694",
                  fontStyle: "italic",
                }}
              >
                {getStatusEmoji(app.status?.status)} {app.status?.status ?? ""}
              </div>
            </div>
          </div>
        ))}
      </div>
       {/* ปุ่ม Logout */}
          <div style={{ marginTop: "auto" }}>
            <button className={styles.btn} onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
    </div>
  );
};

export default DoctorAppointmentPage;

// ฟังก์ชันแสดงอิโมจิตามสถานะ
function getStatusEmoji(status?: string) {
  if (status === "Confirmed") return "⏳"; // นาฬิกาทราย
  if (status === "Completed") return "✔️"; // ติ๊กถูก
  return "";
}
