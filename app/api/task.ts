import axios from "axios";
import {CreateTaskDto, Task, TaskStatus} from "../task/task";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// GET
export const fetchTasks = async (status?: TaskStatus): Promise<Task[]> => {
  const res = await api.get("/task", {
    params: status ? {status} : {},
  });
  return res.data;
};

// GET one task
export const fetchOneTasks = async (id: number): Promise<Task[]> => {
  const res = await api.get(`/task/${id}`);
  return res.data;
};

// POST
export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  const res = await api.post("/task", data);
  return res.data;
};

// PUT
export const updateTask = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Task>;
}): Promise<Task> => {
  const res = await api.put(`/task/${id}`, data);
  return res.data;
};

// DELETE
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/task/${id}`);
};
