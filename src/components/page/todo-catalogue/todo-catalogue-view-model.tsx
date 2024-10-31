import { type Dispatch } from 'redux';

import { type ToDoRepository } from '@/api/repositoiry/todo/todo-repository.types';
import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { toPresenter } from '@/components/page/todo-catalogue/todo-presenter+entity';
import { cancelledError, toErrorMessage } from '@/core/error-utils';
import {
  acknowledgeFetchFirst,
  failedFetchFirst,
  initialFetchFirst,
  loadingFetchFirst,
  successFetchFirst,
} from '@/core/state/todo-catalogue-slice';

export class TodoCatalogueViewModel {
  private controller?: AbortController;

  constructor(
    private repository: ToDoRepository,
    private dispatch: Dispatch,
  ) {}

  resetFetchTodos() {
    this.controller?.abort();
    this.dispatch(initialFetchFirst());
  }

  async fetchTodos() {
    let controller = new AbortController();
    let signal = controller.signal;

    this.controller = controller;

    this.dispatch(loadingFetchFirst());
    return new Promise<void>((resolve, reject) => {
      signal.addEventListener('abort', () => {
        this.dispatch(initialFetchFirst());
        reject(cancelledError);
      });

      this.repository
        .getAllFromLocal(undefined, undefined, undefined)
        .then((todos) => {
          if (signal.aborted) {
            return;
          }
          const todoPresenter: TodoPresenter[] = todos.map(toPresenter);
          this.dispatch(successFetchFirst(todoPresenter));
          resolve();
        })
        .catch((error) => {
          if (signal.aborted) {
            return;
          }
          this.dispatch(failedFetchFirst(toErrorMessage(error)));
          reject(error);
        });
    }).catch((error) => {
      if (error !== cancelledError) {
        throw error;
      }
    });
  }

  acknowledgeFetchTodos() {
    this.dispatch(acknowledgeFetchFirst());
  }
}
