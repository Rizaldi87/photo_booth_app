import type { Frame } from "../types/FrameType";
import api from "./axios";

export const fetchFrames = async (): Promise<Frame[]> => {
  const res = await api.get("/frames");
  return res.data;
};

export const createFrame = async (data: Partial<Frame>) => {
  const res = await api.post("/frames", data);
  return res.data;
};

export const updateFrame = async (id: number, data: Partial<Frame>) => {
  const res = await api.put(`/frames/${id}`, data);
  return res.data;
};

export const deleteFrame = async (id: number) => {
  const res = await api.delete(`/frames/${id}`);
  return res.data;
};
