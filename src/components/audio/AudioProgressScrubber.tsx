import { useState } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { PanResponder, StyleSheet, View } from 'react-native';

interface AudioProgressScrubberProps {
  position: number;
  duration: number;
  onSeek: (positionMs: number) => void;
  trackColor: string;
  fillColor: string;
  containerStyle?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
}

function clampProgressPosition(value: number, duration: number): number {
  if (duration <= 0 || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(duration, value));
}

export function AudioProgressScrubber({
  position,
  duration,
  onSeek,
  trackColor,
  fillColor,
  containerStyle,
  trackStyle,
  fillStyle,
}: AudioProgressScrubberProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [draftPosition, setDraftPosition] = useState(0);

  const displayedPosition = isScrubbing ? draftPosition : clampProgressPosition(position, duration);
  const progress = duration > 0 ? (displayedPosition / duration) * 100 : 0;

  const resolvePosition = (locationX: number) => {
    if (duration <= 0 || trackWidth <= 0) {
      return 0;
    }

    return clampProgressPosition((locationX / trackWidth) * duration, duration);
  };

  const previewPosition = (event: GestureResponderEvent) => {
    const nextPosition = resolvePosition(event.nativeEvent.locationX);
    setIsScrubbing(true);
    setDraftPosition(nextPosition);
    return nextPosition;
  };

  const commitPosition = (event: GestureResponderEvent) => {
    const nextPosition = previewPosition(event);
    setIsScrubbing(false);
    onSeek(nextPosition);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: previewPosition,
    onPanResponderMove: previewPosition,
    onPanResponderRelease: commitPosition,
    onPanResponderTerminate: commitPosition,
    onPanResponderTerminationRequest: () => false,
  });

  return (
    <View style={[styles.container, containerStyle]} onLayout={handleLayout} {...panResponder.panHandlers}>
      <View style={[styles.track, { backgroundColor: trackColor }, trackStyle]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
              backgroundColor: fillColor,
            },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
