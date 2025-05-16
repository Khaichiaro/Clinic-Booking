// src/api.js
const API_BASE = "http://localhost:5003/api";

export async function fetchAppointments() {
  const res = await fetch(`${API_BASE}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}


import type { AppointmentInterface } from '../../interface/IAppointment'; // หรือแก้ path ให้ถูกต้อง

export async function createAppointment(appointmentData: AppointmentInterface) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create appointment");
  }
  return res.json();
}

export async function fetchServiceTypes() {
  const res = await fetch(`${API_BASE}/service_types`);
  if (!res.ok) throw new Error("Failed to fetch service types");
  return res.json();
}

