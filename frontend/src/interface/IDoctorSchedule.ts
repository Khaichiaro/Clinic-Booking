// interface/IDoctorSchedule.ts
export interface IDoctorSchedule {
  doctor_id: number;
  dates: string[]; // Array ของวันที่ในรูปแบบ "YYYY-MM-DD"
  start_time: string; // เวลาเริ่ม "HH:mm"
  end_time: string; // เวลาสิ้นสุด "HH:mm"
}
