import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FAB } from 'react-native-paper';

import Catalogue from '@/app/todo/catalogue';

const StyledFAB = cssInterop(FAB, {
  className: 'style'
});

export default function Segment4() {
  return (
    <>
      <Catalogue />
      <StyledFAB
        icon="plus"
        className="absolute bottom-0 right-0 m-4"
        onPress={() => router.push('/todo/create')}
      />
    </>
  );
}
