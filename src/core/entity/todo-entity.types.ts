export type TodoEntity = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high' | null;
};
