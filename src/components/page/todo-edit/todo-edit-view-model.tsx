import { type Dispatch } from 'redux';

import { type ToDoRepository } from '@/api/repositoiry/todo/todo-repository.types';
import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { toPresenter } from '@/components/page/todo-catalogue/todo-presenter+entity';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { toErrorMessage } from '@/core/error-utils';
import { markAsInvalid } from '@/core/state/todo-catalogue-slice';
import {
  fetchAcknowledge,
  fetchFailed,
  fetchInitial,
  fetchLoading,
  fetchSuccess,
  updateAcknowledge,
  updateFailed,
  updateLoading,
  updateSuccess,
} from '@/core/state/todo-edit-slice';

export class TodoEditViewModel {
  private todo: TodoEntity | null = null;

  constructor(
    private repository: ToDoRepository,
    private dispatch: Dispatch,
  ) {}

  async resetFetch() {
    this.dispatch(fetchInitial());
  }

  async fetch(id: string) {
    this.dispatch(fetchLoading());
    this.repository
      .fetchByIdFromLocal(id)
      .then((todo: TodoEntity) => {
        this.todo = todo;
        const presenter = toPresenter(todo);
        this.dispatch(fetchSuccess(presenter));
      })
      .catch((error) => {
        this.dispatch(fetchFailed(toErrorMessage(error)));
      });
  }

  acknowledgeFetch() {
    this.dispatch(fetchAcknowledge());
  }

  async update(presenter: TodoPresenter) {
    let todo = this.todo;
    if (!todo) {
      return;
    }
    if (presenter.id !== todo.id) {
      return;
    }

    let updatedTodo = {
      ...todo,
      title: presenter.title,
      description: presenter.description,
    };

    this.dispatch(updateLoading());
    this.repository
      .editToLocal(updatedTodo)
      .then((_: TodoEntity) => {
        this.dispatch(updateSuccess());
      })
      .catch((error) => {
        this.dispatch(updateFailed(toErrorMessage(error)));
      });
  }

  acknowledgeUpdate() {
    this.dispatch(updateAcknowledge());
    this.dispatch(markAsInvalid());
  }
}
