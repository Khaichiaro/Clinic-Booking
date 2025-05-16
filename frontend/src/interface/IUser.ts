export interface UserInterface {
  id?: number; // <-- ✅ แก้ให้ optional
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender_id?: number;
  gender?: {
    id: number;
    gender: string;
  }
}