import * as FileSystem from 'expo-file-system';

import { type ToDoLocalDataSource } from '@/api/local/todo/todo-local-datasource.types';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import type { TodoSearchEntity } from '@/core/entity/todo-search-entity';

import { type ToDoRepository } from './todo-repository.types';

export class TodoRepositoryImpl implements ToDoRepository {
  private readonly local: ToDoLocalDataSource;

  constructor(local: ToDoLocalDataSource) {
    this.local = local;
  }

  async getAllFromLocal(
    query: TodoSearchEntity | undefined,
  ): Promise<TodoEntity[]> {
    let result: TodoEntity[];
    if (query) {
      result = await this.local.getAllWithQuery(query);
    } else {
      result = await this.local.getAll();
    }
    return result.map((item) => this.provideLocalPicturePath(item));
  }

  async addToLocal(item: TodoEntity): Promise<TodoEntity> {
    item = await this.omitLocalPicturePath(item);
    let result = await this.local.add(item);
    return this.provideLocalPicturePath(result);
  }

  async fetchByIdFromLocal(id: string): Promise<TodoEntity> {
    let result = await this.local.fetchById(id);
    return this.provideLocalPicturePath(result);
  }

  async editToLocal(item: TodoEntity): Promise<TodoEntity> {
    item = await this.omitLocalPicturePath(item);
    let result = await this.local.edit(item);
    return this.provideLocalPicturePath(result);
  }

  async deleteFromLocal(id: string): Promise<void> {
    return this.local.delete(id);
  }

  async omitLocalPicturePath(item: TodoEntity): Promise<TodoEntity> {
    const picture = item.picture;
    if (!picture) {
      return item;
    }

    if (!picture.startsWith('file://')) {
      return item;
    }

    const documentDirectory = FileSystem.documentDirectory;
    if (!documentDirectory || picture.includes(documentDirectory)) {
      return item;
    }

    const newPicture = `${documentDirectory}todo-pictures/${item.id}.jpg`;
    await FileSystem.copyAsync({
      from: picture,
      to: newPicture,
    });

    return {
      ...item,
      picture: newPicture.replace(documentDirectory, ''),
    };
  }

  provideLocalPicturePath(item: TodoEntity): TodoEntity {
    const picture = item.picture;
    if (!picture) {
      return item;
    }

    const domainPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;
    if (domainPattern.test(picture)) {
      return item;
    }

    if (picture.startsWith('www.')) {
      return item;
    }

    const documentDirectory = FileSystem.documentDirectory;
    if (!documentDirectory) {
      return item;
    }

    return {
      ...item,
      picture: `${documentDirectory}${picture}`,
    };
  }
}
