export type TodoCreatePresenter = {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  picture: string;
};
