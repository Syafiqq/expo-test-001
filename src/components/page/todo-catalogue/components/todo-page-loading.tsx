import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const TodoPageLoading = React.memo(() => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
});
