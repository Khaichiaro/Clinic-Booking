export interface UserInterface {
  id?: number; // <-- ✅ แก้ให้ optional
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  phonenumber?: string;
  gender_id?: number;
  gender?: {
    id: number;
    gender: string;
  }
}
