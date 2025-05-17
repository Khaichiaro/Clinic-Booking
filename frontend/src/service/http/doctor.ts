const DOCTOR_API_BASE = "http://localhost:5002/api";

export async function fetchDoctors() {
  const res = await fetch(`${DOCTOR_API_BASE}/doctors`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

// ฟังก์ชันเรียกเวลาว่างของหมอคนที่ doctorId ในวันที่ date (รูปแบบ "YYYY-MM-DD")
export async function fetchAvailableTimes(doctorId: number, date: string) {
  const res = await fetch(`${DOCTOR_API_BASE}/doctor/${doctorId}/available_times?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch available times");
  return res.json(); // คาดว่า response เป็น { available_times: string[] }
}
