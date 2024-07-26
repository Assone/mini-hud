import { Orientation } from "expo-screen-orientation";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraMonitor from "../components/CameraMonitor";
import CardContainer from "../components/CardContainer";
import {
  EnsureCameraPermission,
  EnsureLocationPermission,
  EnsureMediaLibraryPermission,
  EnsureMicrophonePermission,
} from "../components/EnsurePermissions";
import Speedometer from "../components/Speedometer";
import useOrientation from "../hooks/useOrientation";

export default function App() {
  const { isPortrait, orientation } = useOrientation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { flexDirection: isPortrait ? "column" : "row" },
      ]}
      edges={
        isPortrait
          ? undefined
          : [
              "top",
              "bottom",
              orientation === Orientation.LANDSCAPE_LEFT ? "right" : "left",
            ]
      }
    >
      <CardContainer>
        <EnsureLocationPermission
          fallback={(requestPermission) => (
            <View>
              <Text style={styles.message}>
                We need your permission to show the Location
              </Text>
              <Button onPress={requestPermission} title="grant permission" />
            </View>
          )}
        >
          <Speedometer />
        </EnsureLocationPermission>
      </CardContainer>
      <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
        <CardContainer>
          <EnsureCameraPermission
            fallback={(requestPermission) => (
              <View>
                <Text style={styles.message}>
                  We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
              </View>
            )}
          >
            <EnsureMicrophonePermission
              fallback={(requestPermission) => (
                <View>
                  <Text style={styles.message}>
                    We need your permission to show the micro
                  </Text>
                  <Button
                    onPress={requestPermission}
                    title="grant permission"
                  />
                </View>
              )}
            >
              <EnsureMediaLibraryPermission
                fallback={(requestPermission) => (
                  <View>
                    <Text style={styles.message}>
                      We need your permission to show the media library
                    </Text>
                    <Button
                      onPress={requestPermission}
                      title="grant permission"
                    />
                  </View>
                )}
              >
                <CameraMonitor />
              </EnsureMediaLibraryPermission>
            </EnsureMicrophonePermission>
          </EnsureCameraPermission>
        </CardContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
