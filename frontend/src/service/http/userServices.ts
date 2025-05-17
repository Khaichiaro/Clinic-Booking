import axios from "axios";
import type { UserInterface } from "../../interface/IUser";
import type { GenderInterface } from "../../interface/IGender";

const API_BASE = "http://localhost:5001/api";

export const getAllUsers = async (): Promise<UserInterface[]> => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data.data;
};

export const getUserById = async (id: number): Promise<UserInterface> => {
  const res = await axios.get(`${API_BASE}/user/${id}`);
  return res.data.data;
};

export const createUser = async (user: UserInterface) => {
  const res = await axios.post(`${API_BASE}/user`, user);
  return res.data.data;
};

export const updateUser = async (id: number, updates: Partial<UserInterface>) => {
  const res = await axios.patch(`${API_BASE}/user/${id}`, updates);
  return res.data.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/user/${id}`);
  return res.data;
};

export const getAllGenders = async (): Promise<GenderInterface[]> => {
  const res = await axios.get(`${API_BASE}/genders`);
  return res.data.data;
};
