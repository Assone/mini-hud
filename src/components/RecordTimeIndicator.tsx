import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { formatTime } from "../utils/date";

interface RecordTimeIndicatorProps {
  style?: StyleProp<ViewStyle>;
}

const RecordTimeIndicator: React.FC<RecordTimeIndicatorProps> = ({ style }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{formatTime(time)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFA405",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontWeight: "bold",
    color: "#fff",
  },
});

export default RecordTimeIndicator;
