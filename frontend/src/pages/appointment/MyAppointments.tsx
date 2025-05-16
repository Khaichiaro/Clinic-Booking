import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./MyAppointments.css";
import type { AppointmentInterface,ServiceTypeInterface,DoctorInterface, } from "../../interface/IAppointment";

export default function MyAppointmentsPage() {
  const location = useLocation();
  const initialAppointment = location.state as AppointmentInterface | undefined;

  const [appointment, setAppointment] = useState<AppointmentInterface | null>(
    initialAppointment?.status_id === 1 ? initialAppointment : null
  );
  const [allAppointments, setAllAppointments] = useState<AppointmentInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<ServiceTypeInterface[]>([]);
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch appointments
        const resAppointments = await fetch("http://localhost:5003/api/appointments");
        if (!resAppointments.ok) throw new Error("โหลดข้อมูลการจองไม่สำเร็จ");
        let dataAppointments: AppointmentInterface[] = await resAppointments.json();

        // Fetch services
        const resServices = await fetch("http://localhost:5003/api/service_types");
        if (!resServices.ok) throw new Error("โหลดข้อมูลบริการไม่สำเร็จ");
        const dataServices: ServiceTypeInterface[] = await resServices.json();

        // Fetch doctors
        const resDoctors = await fetch("http://localhost:5002/api/doctors");
        if (!resDoctors.ok) throw new Error("โหลดข้อมูลแพทย์ไม่สำเร็จ");
        const dataDoctors: DoctorInterface[] = await resDoctors.json();

        // กรองเฉพาะสถานะ pending (status_id === 1)
        let pendingOnly = dataAppointments.filter((a) => a.status_id === 1);

        // เพิ่ม initialAppointment ถ้าไม่อยู่ในลิสต์และสถานะ pending
        if (
          initialAppointment &&
          initialAppointment.status_id === 1 &&
          !pendingOnly.some((a) => a.id === initialAppointment.id)
        ) {
          pendingOnly = [initialAppointment, ...pendingOnly];
        }

        // แมปชื่อ service_name และ doctor_name ลงในแต่ละ appointment
        const enhancedAppointments = pendingOnly.map((a) => {
          const service = dataServices.find((s) => s.id === a.servicetype_id);
          const doctor = dataDoctors.find((d) => d.id === a.doctor_id);
          return {
            ...a,
            service_name: service?.service_type ?? "-",
            doctor_name: doctor ? `${doctor.first_name ?? ""} ${doctor.last_name ?? ""}`.trim() : "ยังไม่ระบุ",
          };
        });

        setAllAppointments(enhancedAppointments);
        setServices(dataServices);
        setDoctors(dataDoctors);
      } catch (err: any) {
        alert("เกิดข้อผิดพลาด: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialAppointment]);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5003/api/appointments/${id}`, {
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

        <div style={{ marginTop: "2rem" }}>
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : allAppointments.length === 0 ? (
            <p>ไม่มีการจองที่กำลังรอ</p>
          ) : (
            allAppointments.map((a) => (
              <div key={a.id} className="appointment-card1">
                <div className="appointment-details1">
                  <p>
                    <strong>Date:</strong> {a.appointment_date ?? "-"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {a.appointment_time
                      ? new Date(`1970-01-01T${a.appointment_time}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </p>
                  <p>
                    <strong>Service:</strong> {a.service_name}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {a.doctor_name}
                  </p>
                </div>
                <button className="btn-cancel1" onClick={() => handleCancel(a.id!)}>
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
