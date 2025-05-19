import React, { useState, useEffect } from "react";
import styles from "./DoctorAppointmentPage.module.css";
import { useNavigate } from "react-router-dom";
import { getDoctorById } from "../../service/http/doctor";
import {
  fetchAppointments,
  // สมมติมีฟังก์ชันดึงข้อมูลผู้ใช้ ถ้าไม่มี ต้องแก้ตาม API จริง
  // fetchUserById,
} from "../../service/http/appointment";

import doctorImg from "../../assets/doctorg.png"; // หมอ (หญิง)
import doctorm from "../../assets/doctorm.png";   // หมอ (ชาย)
import pmImg from "../../assets/pm.png";           // คนไข้ชาย
import pgImg from "../../assets/pg.png";           // คนไข้หญิง

type AppointmentInterface = {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;         // "2025-08-16"
  time: string;         // "12:00 PM"
  service_type: string; // ชื่อบริการ
  status: string;       // สถานะนัด
  patient_gender_id: number; // เพศคนไข้ 1=ชาย 2=หญิง
  patient_name: string;
};

const DoctorAppointmentPage: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<AppointmentInterface[]>([]);
  const [displayedAppointments, setDisplayedAppointments] = useState<AppointmentInterface[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // 0-11
  const navigate = useNavigate();
  const doctorId = 1; // กำหนด doctorId

  // โหลดข้อมูลหมอ
  useEffect(() => {
    getDoctorById(doctorId)
      .then(setDoctor)
      .catch(console.error);
  }, [doctorId]);

  // โหลดข้อมูลนัดทั้งหมด
  useEffect(() => {
    fetchAppointments()
      .then((allAppointments) => {
        // กรองนัดเฉพาะของหมอคนนี้
        const filtered = allAppointments.filter((app: AppointmentInterface) => app.doctor_id === doctorId);
        setAppointments(filtered);
      })
      .catch(console.error);
  }, [doctorId]);

  // สร้างวันที่ของเดือนปัจจุบัน (หรือเดือนที่เลือก)
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date)); // clone date object
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // กรองนัดแสดงเฉพาะวันในเดือนที่เลือก
  useEffect(() => {
    const days = getDaysInMonth(currentYear, currentMonth).map(d => d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
    const appsInMonth = appointments.filter(app => days.includes(app.date));
    setDisplayedAppointments(appsInMonth);
  }, [appointments, currentYear, currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(m => (m === 0 ? 11 : m - 1));
    if (currentMonth === 0) setCurrentYear(y => y - 1);
  };

  const nextMonth = () => {
    setCurrentMonth(m => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear(y => y + 1);
  };

  // กำหนดรูปหมอตาม gender_id
  const getDoctorImage = (genderId: number) => {
    if (genderId === 1) return doctorm;
    if (genderId === 2) return doctorImg;
    return doctorm;
  };

  // กำหนดรูปคนไข้ตามเพศ
  const getPatientAvatar = (genderId: number) => {
    if (genderId === 1) return pmImg;
    if (genderId === 2) return pgImg;
    return pmImg;
  };

  const goToDoctorList = () => {
    navigate("/doctorlist");
  };

  // แปลงเดือนเป็นชื่อเดือน (อังกฤษ ย่อ)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
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
            <p className={styles.contactText}>Phone Number: {doctor.phone_number}</p>
            <p className={styles.contactText}>Email: {doctor.email}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={goToDoctorList}>
                DOCTOR
              </button>
              <button className={styles.btn}>PATIENT</button>
            </div>
          </>
        ) : (
          <p>Loading doctor information...</p>
        )}
      </div>

      {/* Right Card */}
      <div className={styles.rightCard}>
        <h3 className={styles.title}>
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}}>
          <button onClick={prevMonth}>&lt; Prev</button>
          <button onClick={nextMonth}>Next &gt;</button>
        </div>

        <div className={styles.dateSelector} style={{flexWrap:"wrap"}}>
          {getDaysInMonth(currentYear, currentMonth).map(dateObj => {
            const dateStr = dateObj.toISOString().slice(0, 10);
            const day = dateObj.getDate();

            return (
              <div key={dateStr} className={styles.dateBox}>
                <div className={styles.dayText}>{day}</div>
                <div className={styles.monthText}>{monthNames[currentMonth]}</div>
                {/* แสดงนัดที่ตรงกับวันนั้น */}
                {displayedAppointments
                  .filter(app => app.date === dateStr)
                  .map(app => (
                    <div key={app.id} className={styles.appointmentCard} style={{backgroundColor: "#D6F0FF", marginTop: "4px"}}>
                      <div className={styles.appointmentTime}>{app.time}</div>
                      <div className={styles.appointmentInfo}>
                        <img
                          src={getPatientAvatar(app.patient_gender_id)}
                          alt="patient"
                          className={styles.avatarImg}
                        />
                        <div>
                          <div className={styles.patientName}>{app.patient_name}</div>
                          <div className={styles.treatmentType}>
                            {app.service_type} - <span>{app.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentPage;
