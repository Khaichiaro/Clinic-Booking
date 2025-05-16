import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MyAppointments.css";

type Appointment = {
  id: number;
  appointment_date: string;
  appointment_time: string;
  servicetype_id: number;
  status_id: number;
  doctor_id: number | null;
  service_name?: string;
  doctor_name?: string;
  date?: string; // สำหรับ location.state
  time?: string;
  service?: string;
};

export default function MyAppointmentsPage() {
  const location = useLocation();
  const initialAppointment = location.state;

  const [appointment, setAppointment] = useState(
    initialAppointment?.status_id === 1 ? initialAppointment : null
  );

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5002/api/appointments")
      .then((res) => {
        if (!res.ok) throw new Error("โหลดข้อมูลการจองไม่สำเร็จ");
        return res.json();
      })
      .then((data: Appointment[]) => {
        const pendingOnly = data.filter((a) => a.status_id === 1);
        setAllAppointments(pendingOnly);
      })
      .catch((err) => alert("เกิดข้อผิดพลาด: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5002/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: 3 }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "ไม่สามารถยกเลิกการจองได้");
      }

      alert("การจองถูกยกเลิกแล้ว");

      setAllAppointments((prev) => prev.filter((a) => a.id !== id));
      if (appointment?.id === id) setAppointment(null);
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <div className="appointment-wrapper1">
      <div className="appointment-container1">
        <h2 className="title">My Appointments</h2>

        {/* 🔹 การจองทั้งหมดที่ pending จาก API */}
        <div style={{ marginTop: "2rem" }}>
          
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : allAppointments.length === 0 ? (
            <p>ไม่มีการจองที่กำลังรอ</p>
          ) : (
            allAppointments.map((a) => (
              <div key={a.id} className="appointment-card1">
                <div className="appointment-details1">
                  <p><strong>Date:</strong> {a.appointment_date}</p>
                  <p><strong>Time:</strong> {new Date(a.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  <p><strong>Service:</strong> {a.service_name || "-"}</p>
                  <p><strong>Doctor:</strong> {a.doctor_name || "ยังไม่ระบุ"}</p>
                </div>
                <button className="btn-cancel1" onClick={() => handleCancel(a.id)}>
                  ยกเลิกการจอง
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
