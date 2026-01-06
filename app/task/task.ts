export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
}
export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
}
