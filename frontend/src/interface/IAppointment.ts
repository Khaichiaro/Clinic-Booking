export interface StatusInterface {
  id?: number;
  status?: string;
}

export interface ServiceTypeInterface {
  id?: number;
  service_type?: string;
}

export interface AppointmentInterface {
  id?: number;
  appointment_time?: string;   // เก็บเป็นเวลา เช่น "09:00:00"
  appointment_date?: string;   // เก็บเป็นวันที่ เช่น "2025-05-20"
  user_id?: number;
  servicetype_id?: number;
  status_id?: number;
  doctor_id?: number;

  user?: UserInterface;
  service_type?: ServiceTypeInterface;
  status?: StatusInterface;
  doctor?: DoctorInterface;
}

export interface UserInterface {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender_id?: number;
  gender?: GenderInterface;
}

export interface DoctorInterface {
  id?: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  gender_id?: number;
  gender?: GenderInterface;
}

export interface GenderInterface {
  id?: number;
  gender?: string;
}
