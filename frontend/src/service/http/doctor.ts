import axios from "axios";
import type { DoctorInterface } from "../../interface/IDoctor";
import type { GenderInterface } from "../../interface/IGender";

const DOCTOR_API_BASE = "http://localhost/api";

export const getDoctors = async (): Promise<DoctorInterface[]> => {
  const res = await axios.get(`${DOCTOR_API_BASE}/doctors/`);
  return res.data;
};

export const getDoctorById = async (id: number): Promise<DoctorInterface> => {
  const res = await axios.get(`${DOCTOR_API_BASE}/doctor/${id}/`);
  return res.data.data;
};

export const createDoctor = async (doctor: DoctorInterface) => {
  const res = await axios.post(`${DOCTOR_API_BASE}/doctor/`, doctor);
  return res.data;
};

export const deleteDoctor = async (id: number) => {
  const res = await axios.delete(`${DOCTOR_API_BASE}/doctor/${id}/`);
  return res.data;
};

export const getAllGenders = async (): Promise<GenderInterface[]> => {
  const res = await axios.get(`${DOCTOR_API_BASE}/genders/`);
  return res.data.data;
};

export async function fetchDoctors() {
  const res = await fetch(`${DOCTOR_API_BASE}/doctors/`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

// ฟังก์ชันเรียกเวลาว่างของหมอคนที่ doctorId ในวันที่ date (รูปแบบ "YYYY-MM-DD")
export async function fetchAvailableTimes(doctorId: number, date: string) {
  const res = await fetch(`${DOCTOR_API_BASE}/doctor/${doctorId}/available_times?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch available times");
  const data = await res.json();
  console.log("Available times data:", data);
  return data;
}
