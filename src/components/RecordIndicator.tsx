import { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface RecordIndictoryProps {
  style?: StyleProp<ViewStyle>;
}

const RecordIndictory: React.FC<RecordIndictoryProps> = ({ style }) => {
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      true,
    );
  }, []);

  return <Animated.View style={[styles.indicator, animatedStyle, style]} />;
};

const styles = StyleSheet.create({
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 100,
    overflow: "hidden",
  },
});

export default RecordIndictory;
