import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import TodoEdit from '@/components/page/todo-edit/todo-edit';

type Props = {
  id: string;
};

export default function Edit() {
  const local = useLocalSearchParams<Props>();

  return <TodoEdit {...local}></TodoEdit>;
}
