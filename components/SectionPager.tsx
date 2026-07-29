// Horizontal swipe pager hosting the app sections. The panel row is dragged in
// the direction of the gesture (Reanimated), and snaps to the nearest panel by
// distance + velocity on release. A horizontal-only activation lets each panel's
// vertical ScrollView and taps keep working.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSections } from '../src/SectionsContext';

const OVERSCROLL = 48; // rubber-band slack past the first/last panel

export function SectionPager({ children }: { children: React.ReactNode }) {
  const { width, count, translateX, setActive } = useSections();
  const panels = React.Children.toArray(children);
  const startX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-12, 12])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      const min = -(count - 1) * width - OVERSCROLL;
      const max = OVERSCROLL;
      const next = startX.value + e.translationX;
      translateX.value = Math.min(max, Math.max(min, next));
    })
    .onEnd((e) => {
      const current = width > 0 ? -translateX.value / width : 0;
      let target = Math.round(current);
      if (e.velocityX < -500) target = Math.ceil(current);
      else if (e.velocityX > 500) target = Math.floor(current);
      target = Math.max(0, Math.min(count - 1, target));
      translateX.value = withTiming(-target * width, { duration: 220 });
      runOnJS(setActive)(target);
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.row, { width: width * count }, rowStyle]}>
        {panels.map((panel, i) => (
          <View key={i} style={{ width }}>
            {panel}
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
