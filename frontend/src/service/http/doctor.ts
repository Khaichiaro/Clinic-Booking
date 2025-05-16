const DOCTOR_API_BASE = "http://localhost:5002/api";

export async function fetchDoctors() {
  const res = await fetch(`${DOCTOR_API_BASE}/doctors`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}