import { type Dispatch } from 'redux';

import { type ToDoRepository } from '@/api/repositoiry/todo/todo-repository.types';
import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { toDomain } from '@/components/page/todo-add/todo-create-presenter+entity';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { toErrorMessage } from '@/core/error-utils';
import { markAsInvalid } from '@/core/state/todo-catalogue-slice';
import {
  acknowledge,
  failed,
  loading,
  success,
} from '@/core/state/todo-create-slice';

export class TodoCreateViewModel {
  constructor(
    private repository: ToDoRepository,
    private dispatch: Dispatch,
  ) {}

  async createTodo(data: TodoCreatePresenter) {
    this.dispatch(loading());
    this.repository
      .addToLocal(toDomain(data))
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
