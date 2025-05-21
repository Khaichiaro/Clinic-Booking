// Updated MyAppointmentsPage with service extraction
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./MyAppointments.css";
import type {
  AppointmentInterface,
  ServiceTypeInterface,
  DoctorInterface,
} from "../../interface/IAppointment";

import logo from "../../assets/logo3.svg";
import {
  fetchAppointments,
  fetchServiceTypes,
  updateAppointmentStatus,
} from "../../service/http/appointment";
import { fetchDoctors } from "../../service/http/doctor";
import Navbar from "../../components/navbar/Navbar";

export default function MyAppointmentsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId || localStorage.getItem("userId");
  const initialAppointment = location.state as AppointmentInterface | undefined;

  const [appointment, setAppointment] = useState<AppointmentInterface | null>(
    initialAppointment?.status_id === 1 ? initialAppointment : null
  );
  const [allAppointments, setAllAppointments] = useState<
    AppointmentInterface[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [, setServices] = useState<ServiceTypeInterface[]>([]);
  const [, setDoctors] = useState<DoctorInterface[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const dataAppointments = await fetchAppointments();
        const dataServices = await fetchServiceTypes();
        const dataDoctors = await fetchDoctors();

        let pendingOnly = dataAppointments.filter(
          (a) => a.status_id === 1 && String(a.user_id) === String(userId)
        );

        if (
          initialAppointment &&
          initialAppointment.status_id === 1 &&
          !pendingOnly.some((a) => a.id === initialAppointment.id)
        ) {
          pendingOnly = [initialAppointment, ...pendingOnly];
        }

        const enhancedAppointments = pendingOnly.map((a) => {
          const service = dataServices.find(
            (s: { id: number | undefined }) => s.id === a.servicetype_id
          );
          const doctor = dataDoctors.find(
            (d: { id: number | undefined }) => d.id === a.doctor_id
          );
          return {
            ...a,
            service_name: service?.service_type ?? "-",
            doctor_name: doctor
              ? `${doctor.first_name ?? ""} ${doctor.last_name ?? ""}`.trim()
              : "ยังไม่ระบุ",
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
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    try {
      await updateAppointmentStatus(id, 3);
      alert("The appointment has been cancelled.");
      setAllAppointments((prev) => prev.filter((a) => a.id !== id));
      if (appointment?.id === id) setAppointment(null);
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="appointment-wrapper1">
        <div className="appointment-container1">
          <div className="logo-container">
            <img src={logo} alt="Clinic Logo" className="logo-image" />
          </div>

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
                        ? new Date(
                            `1970-01-01T${a.appointment_time}`
                          ).toLocaleTimeString([], {
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
                  <button
                    className="btn-cancel1"
                    onClick={() => handleCancel(a.id!)}
                  >
                    CANCEL
                  </button>
                </div>
              ))
            )}
          </div>
          <div>
            <div className="nav-buttons">
              <button className="btn-back" onClick={() => navigate("/")}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
