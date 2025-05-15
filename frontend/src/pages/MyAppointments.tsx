import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./MyAppointments.css"

export default function MyAppointmentsPage() {
  const location = useLocation();
  const initialAppointment = location.state;
  const [appointment, setAppointment] = useState(initialAppointment);

  const handleCancel = async () => {
    const confirmed = window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?");
    if (!confirmed) return;

    try {
      // เรียก PATCH API อัพเดต status_id = 3 (ยกเลิก)
      const response = await fetch(`http://localhost:5002/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: 3 }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "ไม่สามารถยกเลิกการจองได้");
      }

      alert("การจองถูกยกเลิกแล้ว");
      setAppointment(null); // ล้างข้อมูลแสดงว่าไม่มีการจอง
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <div className="appointment-wrapper1">
      <div className="appointment-container1">
        <h2 className="title">My Appointments</h2>
        {appointment ? (
          <div className="appointment-card1">
            <div className="appointment-details1">
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Service:</strong> {appointment.service}</p>
            </div>
            <button className="btn-cancel1" onClick={handleCancel}>
              ยกเลิกการจอง
            </button>
          </div>
        ) : (
          <p>ไม่มีการจองล่าสุด</p>
        )}
      </div>
    </div>
  );
}
