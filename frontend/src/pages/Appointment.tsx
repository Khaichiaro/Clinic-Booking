import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Appointment.css";

export default function AppointmentPage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("13:00 - 14:00");
  const [selectedService, setSelectedService] = useState("");
  const [step, setStep] = useState<"datetime" | "service" | "overview">("datetime");

  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5002/api/service_types")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        const serviceNames = data.map((item: any) => item.service_type);
        setServices(serviceNames);
        if (serviceNames.length > 0 && !selectedService) {
          setSelectedService(serviceNames[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        // fallback กรณี fetch ล้มเหลว
        const fallbackServices = [
          "ขูดหินปูน",
          "ถอนฟัน",
          "อุดฟัน",
          "จัดฟัน",
          "ฟอกสีฟัน",
          "รักษารากฟัน",
          "วีเนียร์ฟัน",
          "ครอบฟัน",
        ];
        setServices(fallbackServices);
        if (!selectedService) setSelectedService(fallbackServices[0]);
      });
  }, []);

  const times = [
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ];

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

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <div className="docapp">
    <div className="appointment-wrapper">
      <div className="appointment-container">
        <div className="appointment-content">
          <div className="title">New appointment</div>
          <div className="steps">
            <span className={step === "datetime" ? "active" : ""}>Date & Time</span>
            <span className={step === "service" ? "active" : ""}>Service</span>
            <span className={step === "overview" ? "active" : ""}>Overview</span>
          </div>

          {step === "datetime" && (
            <>
              <div className="month-nav">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{currentMonth.format("MMMM")}</span>
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
                    onClick={() => date && setSelectedDate(date.format("YYYY-MM-DD"))}
                    disabled={!date}
                  >
                    {date ? date.date() : ""}
                  </button>
                ))}
              </div>
              <div className="section-label">Available times</div>
              <div className="times-scroll">
                {times.map((time) => (
                  <button
                    key={time}
                    className={`time-button ${selectedTime === time ? "selected-time" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button className="btn-continue" onClick={() => setStep("service")}>
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
                    key={service}
                    className={`service-button ${selectedService === service ? "selected-service" : ""}`}
                    onClick={() => setSelectedService(service)}
                  >
                    {service}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => setStep("datetime")}>
                  &larr; Back
                </button>
                <button className="btn-continue" onClick={() => setStep("overview")}>
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
                  <strong>Date:</strong> {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Service:</strong> {selectedService}
                </p>
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => setStep("service")}>
                  &larr; Back
                </button>
               <button
  className="btn-confirm"
  onClick={async () => {
    try {
      const appointmentDate = selectedDate;
      const appointmentTimeStart = selectedTime.split(" - ")[0];
      const appointmentDateTimeISO = new Date(`${appointmentDate}T${appointmentTimeStart}:00`).toISOString();

      const payload = {
        appointment_date: appointmentDate,
        appointment_time: appointmentDateTimeISO,
        user_id: 1, // แก้ตามระบบจริง
        servicetype_id: services.indexOf(selectedService) + 1, // แก้ตาม id จริง
        status_id: 1,
        doctor_id: null,
      };

      const response = await fetch("http://localhost:5002/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create appointment");
      }

      const data = await response.json();
      const appointmentId = data.id; // รับ id จาก backend

      alert("Appointment confirmed!");

      navigate("/my-appointments", {
        state: {
          id: appointmentId,  // ส่ง id ด้วย
          date: appointmentDate,
          time: selectedTime,
          service: selectedService,
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
