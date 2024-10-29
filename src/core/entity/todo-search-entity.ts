export type TodoSearchPriority = 'low' | 'medium' | 'high';
export type TodoSearchCompleteness = 'complete' | 'incomplete';
export type TodoSearchOrder = {
  name: string;
  status: 'ascending' | 'descending';
};

export type TodoSearchEntity = {
  after: number | undefined;
  before: number | undefined;
  priorities: TodoSearchPriority[];
  completeness: TodoSearchCompleteness[];
  ordering: TodoSearchOrder[];
};
