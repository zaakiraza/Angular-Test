export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

export interface CreateTask {
  title: string;
  description: string | null;
}

export type UpdateTask = Partial<CreateTask> & { completed?: boolean };
