import { uuid } from 'expo-modules-core';
import { type Dispatch } from 'redux';

import { type ToDoRepository } from '@/api/repositoiry/todo/todo-repository.types';
import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { toErrorMessage } from '@/core/error-utils';
import {
  acknowledge,
  failed,
  loading,
  success,
} from '@/core/state/todo-create-slice';
import { markAsInvalid } from '@/core/state/todo-catalogue-slice';

export class TodoCreateViewModel {
  constructor(
    private repository: ToDoRepository,
    private dispatch: Dispatch,
  ) {}

  async createTodo(data: TodoCreatePresenter) {
    // randomise due date
    let now = new Date();
    let entity: TodoEntity = {
      id: uuid.v4(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)),
      priority: 'low',
    };

    this.dispatch(loading());
    this.repository
      .addToLocal(entity)
      .then((_: TodoEntity) => {
        this.dispatch(success());
      })
      .catch((error) => {
        this.dispatch(failed(toErrorMessage(error)));
      });
  }

  acknowledgeCrate() {
    this.dispatch(acknowledge());
    this.dispatch(markAsInvalid());
  }
}
