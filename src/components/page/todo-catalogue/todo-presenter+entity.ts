import { formatDistance } from 'date-fns/formatDistance';

import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { nullableToNull } from '@/core/type-utils';

export function toPresenter(todo: TodoEntity): TodoPresenter {
  const now = new Date();
  let dueDateString: string;
  let dueDate = todo.dueDate;
  if (dueDate) {
    const result = formatDistance(now, dueDate);
    dueDateString = `Due to: ${result}`;
  } else {
    dueDateString = 'No due date';
  }

  return {
    id: todo.id,
    title: todo.title,
    description: todo.description ?? '-',
    dueDate: dueDateString,
    completed: todo.completed,
    priority: nullableToNull(todo.priority),
  };
}
