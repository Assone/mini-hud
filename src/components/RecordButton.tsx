import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface RecordButtonProps {
  style?: StyleProp<ViewStyle>;
  isRecording: boolean;
  onRecord: (isRecording: boolean) => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  style,
  isRecording,
  onRecord,
}) => {
  const opacity = useSharedValue(1);
  const size = useSharedValue(45);
  const borderRadius = useSharedValue(30);

  const startRecording = () => {
    onRecord(true);

    opacity.value = withRepeat(
      withTiming(0.7, { duration: 500, easing: Easing.linear }),
      -1,
      true
    );
    size.value = withTiming(20, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    borderRadius.value = withTiming(8, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const stopRecording = () => {
    onRecord(false);

    opacity.value = withTiming(1);
    size.value = withTiming(45, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    borderRadius.value = withTiming(30, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // transform: [{ scale: scale.value }],
      opacity: opacity.value,
      width: size.value,
      height: size.value,
      borderRadius: borderRadius.value,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPressOut={isRecording ? stopRecording : startRecording}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Animated.View style={[styles.innerButton, animatedStyle]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    backgroundColor: "#f0f0f0",
  },
  innerButton: {
    backgroundColor: "red",
  },
});

export default RecordButton;
