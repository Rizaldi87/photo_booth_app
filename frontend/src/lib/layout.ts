import type { Layout } from "../types/LayouOutType";
import api from "./axios";

export const createLayout = async (data: Partial<Layout>) => {
  const res = await api.post("/layouts", data);
  return res.data;
};

export const updateLayout = async (id: number, data: Partial<Layout>) => {
  const res = await api.put(`/layouts/${id}`, data);
  return res.data;
};

export const deleteLayout = async (id: number) => {
  const res = await api.delete(`/layouts/${id}`);
  return res.data;
};

export const fetchLayouts = async (): Promise<Layout[]> => {
  const res = await api.get("/layouts");
  return res.data;
};
