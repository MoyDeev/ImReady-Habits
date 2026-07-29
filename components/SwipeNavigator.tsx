import React from 'react';
import { View, PanResponder } from 'react-native';
import { useRouter, type Href } from 'expo-router';

type Props = {
  prevRoute?: Href;
  nextRoute?: Href;
  children: React.ReactNode;
};

export function SwipeNavigator({ prevRoute, nextRoute, children }: Props) {
  const router = useRouter();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) =>
      Math.abs(gs.dx) > 20 && Math.abs(gs.dy) < 10,
    onPanResponderRelease: (_, gs) => {
      if (gs.dx > 50 && prevRoute) {
        router.navigate(prevRoute);
      } else if (gs.dx < -50 && nextRoute) {
        router.navigate(nextRoute);
      }
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
