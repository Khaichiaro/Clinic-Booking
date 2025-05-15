import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Appointment.css";

export default function AppointmentPage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const navigate = useNavigate(); // <<== เพิ่มตรงนี้
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("13:00 - 14:00");
  const [selectedService, setSelectedService] = useState("ขูดหินปูน");
  const [step, setStep] = useState<"datetime" | "service" | "overview">("datetime");

  const services = ["ขูดหินปูน","ถอนฟัน", "อุดฟัน", "จัดฟัน","ฟอกสีฟัน","รักษารากฟัน","วีเนียร์ฟัน","ครอบฟัน"];
  const times = ["11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00","15:00 - 16:00","17:00 - 18:00","18:00 - 19:00","19:00 - 20:00"];

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
                <button className="btn-back" onClick={() => setStep("datetime")}>&larr; Back</button>
                <button className="btn-continue" onClick={() => setStep("overview")}>CONTINUE</button>
              </div>
            </>
          )}

          {step === "overview" && (
            <>
              <div className="section-label">Review your appointment</div>
              <div className="overview-box">
                <p><strong>Date:</strong> {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Service:</strong> {selectedService}</p>
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => setStep("service")}>&larr; Back</button>
                <button
                className="btn-confirm"
                onClick={() => {
                    alert("Appointment confirmed!");
                    navigate("/my-appointments", {
                        state: {
                          date: selectedDate,
                          time: selectedTime,
                          service: selectedService,
                        },
                      });
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
  );
}
