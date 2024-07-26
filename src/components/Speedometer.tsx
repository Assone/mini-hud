import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { formatTime } from "../utils/date";

const { width } = Dimensions.get("window");
const size = width * 0.8;
const strokeWidth = 30;
const radius = (size - strokeWidth) / 2;
const center = size / 2;
const arcLength = Math.PI * radius;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

interface SpeedometerProps {}

const Speedometer: React.FC<SpeedometerProps> = ({}) => {
  const speedAnim = useRef(new Animated.Value(0)).current;

  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  const updateData = (currentSpeed: number) => {
    Animated.parallel([
      Animated.timing(speedAnim, {
        toValue: currentSpeed,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const arcOffset = speedAnim.interpolate({
    inputRange: [0, 60],
    outputRange: [arcLength, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    speedAnim.addListener(({ value }) => {
      setSpeed(value);
    });
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      await Location.enableNetworkProviderAsync();

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          // Speed is in meters/second, convert to km/h
          const currentSpeed = Math.max((location.coords.speed || 0) * 3.6, 0);
          updateData(currentSpeed);
        }
      );
    };

    startLocationTracking();

    // Start timer
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
      setDistance((prevDistance) => prevDistance + Math.max(speed, 0) / 3600); // Simple distance estimation
    }, 1000);

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      clearInterval(timer);
    };
  }, [speed]);

  return (
    <View style={[styles.container]}>
      <Svg width={size} height={size / 2 + 40}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="100%" stopColor="#f44336" />
          </LinearGradient>
        </Defs>

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${arcLength}`}
          strokeDashoffset={arcLength}
          strokeLinecap="round"
          fill="none"
        />
        <AnimatedPath
          d={`M${strokeWidth / 2},${center} A${radius},${radius} 0 0 1 ${
            size - strokeWidth / 2
          },${center}`}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${arcLength}`}
          strokeDashoffset={arcOffset}
          strokeLinecap="round"
          fill="none"
        />
        <AnimatedSvgText
          x={center}
          y={center + 20}
          fontSize="48"
          fontWeight="bold"
          fill="#fff"
          textAnchor="middle"
        >
          {speed.toFixed(2)}
        </AnimatedSvgText>
        <SvgText
          x={center}
          y={center + 60}
          fontSize="24"
          fill="#aaa"
          textAnchor="middle"
        >
          km/h
        </SvgText>
      </Svg>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <AnimatedText style={styles.infoValue}>
            {distance.toFixed(2)}
          </AnimatedText>
          <Text style={styles.infoLabel}>KM</Text>
        </View>
        <View style={styles.infoItem}>
          <AnimatedText style={styles.infoValue}>
            {formatTime(time)}
          </AnimatedText>
          <Text style={styles.infoLabel}>TIME</Text>
        </View>
      </View>
    </View>
  );
};

const AnimatedText = Animated.createAnimatedComponent(Text);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  infoItem: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  infoLabel: {
    fontSize: 18,
    color: "#aaa",
  },
});

export default Speedometer;
