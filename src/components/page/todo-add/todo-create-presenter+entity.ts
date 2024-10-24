import { uuid } from 'expo-modules-core';

import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { type TodoEntity } from '@/core/entity/todo-entity.types';

export function toDomain(data: TodoCreatePresenter): TodoEntity {
  let now = new Date();
  return {
    id: uuid.v4(),
    title: data.title,
    description: data.description,
    completed: false,
    createdAt: now,
    updatedAt: now,
    dueDate: data.dueDate,
    priority: 'low',
  };
}
