import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import "./Appointment.css";
import {
  fetchServiceTypes,
  createAppointment,
} from "../../service/http/appointment";
import { fetchDoctors, fetchAvailableTimes } from "../../service/http/doctor";
import type { ServiceTypeInterface } from "../../interface/IAppointment";

export default function AppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || 1;

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [step, setStep] = useState<
    "datetime" | "service" | "doctor" | "overview"
  >("datetime");

  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [services, setServices] = useState<ServiceTypeInterface[]>([]);
  const [selectedService, setSelectedService] =
    useState<ServiceTypeInterface | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchServiceTypes();
        setServices(data);
        if (!selectedService && data.length > 0) {
          setSelectedService(data[0]);
        }
      } catch (err) {
        console.error(err);
        const fallback = [
          { id: 5, service_type: "Tooth Extraction" },
          { id: 6, service_type: "Filling" },
          { id: 7, service_type: "Orthodontics" },
        ];
        setServices(fallback);
        if (!selectedService) setSelectedService(fallback[0]);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await fetchDoctors();
        const doctorsWithId = data.map((doc: any) => ({
          id: doc.id,
          name: `${doc.first_name} ${doc.last_name}`,
        }));
        setDoctors(doctorsWithId);
        if (doctorsWithId.length > 0 && !selectedDoctor) {
          setSelectedDoctor(doctorsWithId[0].name);
        }
      } catch (err) {
        console.error(err);
        const fallbackDoctors = [
          { id: 1, name: "นพ. สมชาย" },
          { id: 2, name: "นพ. สมหญิง" },
          { id: 3, name: "นพ. อภิวัฒน์" },
        ];
        setDoctors(fallbackDoctors);
        if (!selectedDoctor) setSelectedDoctor(fallbackDoctors[0].name);
      }
    }
    loadDoctors();
  }, []);

  useEffect(() => {
    async function loadAvailableTimes() {
      if (step === "doctor" && selectedDoctor && selectedDate) {
        try {
          const doctorObj = doctors.find((d) => d.name === selectedDoctor);
          const doctorId = doctorObj?.id;

          if (!doctorId) {
            throw new Error("Doctor ID not found");
          }

          console.log(
            "Fetching available times for doctorId:",
            doctorId,
            "date:",
            selectedDate
          );
          const data = await fetchAvailableTimes(doctorId, selectedDate);
          console.log("Available times data:", data);
          setAvailableTimes(data.available_times || []);
          setSelectedTime("");
        } catch (error) {
          console.error("Failed to load available times", error);
          setAvailableTimes([]);
        }
      }
    }
    loadAvailableTimes();
  }, [step, selectedDoctor, selectedDate, doctors]);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf("month").day();
  const startIndex = firstDay === 0 ? 6 : firstDay - 1;

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < startIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs(currentMonth).date(i));
    }
    return days;
  };

  const calendarDays = generateCalendar();

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <div className="docapp">
      <div className="appointment-wrapper">
        <div className="appointment-container">
          <div className="appointment-content">
            <div className="title">New appointment</div>
            <div className="steps">
              <span className={step === "datetime" ? "active" : ""}>Date</span>
              <span className={step === "service" ? "active" : ""}>Service</span>
              <span className={step === "doctor" ? "active" : ""}>
                Doctor & Time
              </span>
              <span className={step === "overview" ? "active" : ""}>Overview</span>
            </div>

            {step === "datetime" && (
              <>
                <div className="month-nav">
                  <button onClick={handlePrevMonth}>&lt;</button>
                  <span>{currentMonth.format("MMMM YYYY")}</span>
                  <button onClick={handleNextMonth}>&gt;</button>
                </div>
                <div className="calendar-header">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {calendarDays.map((date, idx) => (
                    <button
                      key={idx}
                      className={`calendar-cell ${
                        date
                          ? selectedDate === date.format("YYYY-MM-DD")
                            ? "selected-date"
                            : ""
                          : "empty"
                      }`}
                      onClick={() =>
                        date && setSelectedDate(date.format("YYYY-MM-DD"))
                      }
                      disabled={!date}
                    >
                      {date ? date.date() : ""}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-continue"
                  onClick={() => setStep("service")}
                >
                  CONTINUE
                </button>
              </>
            )}

            {step === "service" && (
              <>
                <div className="section-label">Select a service</div>
                <div className="service-list">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      className={`service-button ${
                        selectedService?.id === service.id
                          ? "selected-service"
                          : ""
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      {service.service_type}
                    </button>
                  ))}
                </div>
                <div className="nav-buttons">
                  <button className="btn-back" onClick={() => setStep("datetime")}>
                    Back
                  </button>
                  <button className="btn-continue" onClick={() => setStep("doctor")}>
                    CONTINUE
                  </button>
                </div>
              </>
            )}
            {step === "doctor" && (
              <>
                <div className="section-label">Select a doctor</div>
                <div className="service-list">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      className={`service-button ${
                        selectedDoctor === doctor.name ? "selected-service" : ""
                      }`}
                      onClick={() => setSelectedDoctor(doctor.name)}
                    >
                      {doctor.name}
                    </button>
                  ))}
                </div>

                <div className="section-label" style={{ marginTop: "1rem" }}>
                  Select available time
                </div>
                <div className="times-scroll">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <button
                        key={time}
                        className={`time-button ${
                          selectedTime === time ? "selected-time" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <p>No available times for selected doctor on this date.</p>
                  )}
                </div>
                <div className="nav-buttons">
                  <button className="btn-back" onClick={() => setStep("service")}>
                    Back
                  </button>
                  <button
                    className="btn-continue"
                    disabled={!selectedTime}
                    onClick={() => setStep("overview")}
                  >
                    CONTINUE
                  </button>
                </div>
              </>
            )}

            {step === "overview" && (
              <>
                <div className="section-label">Review your appointment</div>
                <div className="overview-box">
                  <p>
                    <strong>Date:</strong>{" "}
                    {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Service:</strong> {selectedService?.service_type}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {selectedDoctor}
                  </p>
                </div>
                <div className="nav-buttons">
                  <button className="btn-back" onClick={() => setStep("doctor")}>
                    Back
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={async () => {
                      try {
                        const appointmentDate = selectedDate;
                        const appointmentTimeStart =
                          selectedTime.split(" - ")[0];

                        // หา doctorId จากชื่อหมอ
                        const doctorObj = doctors.find(
                          (d) => d.name === selectedDoctor
                        );
                        const doctorId = doctorObj?.id || 0;

                        const payload = {
                          appointment_date: appointmentDate,
                          appointment_time: appointmentTimeStart + ":00",
                          user_id: parseInt(userId),
                          servicetype_id: selectedService?.id,
                          status_id: 1,
                          doctor_id: doctorId,
                          doctor_name: selectedDoctor,
                          service_name: selectedService?.service_type,
                        };

                        const data = await createAppointment(payload);
                        const appointmentId = data.id;

                        alert("Appointment confirmed!");

                        navigate("/my-appointments", {
                          state: {
                            id: appointmentId,
                            userId: userId,
                            date: appointmentDate,
                            time: selectedTime,
                            service: selectedService?.service_type,
                            doctor: selectedDoctor,
                          },
                        });
                      } catch (error: any) {
                        alert("Error: " + error.message);
                      }
                    }}
                  >
                    CONFIRM
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
