export interface UserInterface {
  id?: number; // ให้ optional
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender_id?: number;
  gender?: {
    id: number;
    gender: string;
  }
}