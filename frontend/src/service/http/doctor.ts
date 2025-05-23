import axios from "axios";
import type { DoctorInterface } from "../../interface/IDoctor";
import type { GenderInterface } from "../../interface/IGender";
import type { IDoctorSchedule } from "../../interface/IDoctorSchedule";

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
  const res = await axios.get(`${DOCTOR_API_BASE}/doctor-genders/`);
  return res.data.data;
};

export async function fetchDoctors() {
  const res = await fetch(`${DOCTOR_API_BASE}/doctors/`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function fetchAppointments(doctorId?: number) {
  let url = `${DOCTOR_API_BASE}/doctor/appointments/`;
  if (doctorId !== undefined) {
    url += `?doctor_id=${doctorId}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json(); // คาดว่า response เป็น array ของ appointment objects
}


// ฟังก์ชันเรียกเวลาว่างของหมอคนที่ doctorId ในวันที่ date (รูปแบบ "YYYY-MM-DD")
export async function fetchAvailableTimes(doctorId: number, date: string) {
  const res = await fetch(`${DOCTOR_API_BASE}/doctor/${doctorId}/available_times?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch available times");
  const data = await res.json();
  console.log("Available times data:", data);
  return data;
}

export const createDoctorSchedule = async (
  doctorId: number,
  dates: string[], // Array ของวันที่ที่เลือก
  startTime: string, // เวลาเริ่ม "HH:mm"
  endTime: string // เวลาสิ้นสุด "HH:mm"
) => {
  try {
    // เตรียมข้อมูลที่ต้องส่งไปยัง API
    const scheduleData: IDoctorSchedule = {
      doctor_id: doctorId,
      dates: dates,
      start_time: startTime,
      end_time: endTime,
    };

    // ส่งข้อมูลไปยัง API
    const response = await axios.post(`${DOCTOR_API_BASE}/doctor/doctor_schedule/`, scheduleData);
    
    // หาก API ส่งกลับข้อความสำเร็จ
    return response.data;
  } catch (error) {
    console.error("Error creating doctor schedule:", error);
    throw new Error("Failed to create doctor schedule");
  }
};