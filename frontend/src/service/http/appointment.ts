// src/service/http/appointment.ts
const API_BASE = "http://localhost:5003/api";

import type { AppointmentInterface } from "../../interface/IAppointment"; // ปรับ path ให้ถูกต้องตามโปรเจกต์ของคุณ

// ดึงนัดทั้งหมด
export async function fetchAppointments(): Promise<AppointmentInterface[]> {
  const res = await fetch(`${API_BASE}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

// สร้างการนัดใหม่
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

// ดึงประเภทบริการ
export async function fetchServiceTypes() {
  const res = await fetch(`${API_BASE}/service_types`);
  if (!res.ok) throw new Error("Failed to fetch service types");
  return res.json();
}

// ยกเลิกหรืออัปเดตสถานะนัด (ใช้ได้กับ cancel หรือ status อื่น)
export async function updateAppointmentStatus(id: number, status_id: number) {
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status_id }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update appointment status");
  }

  return res.json();
}
