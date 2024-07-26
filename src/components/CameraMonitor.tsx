import { CameraView } from "expo-camera";
import { createAssetAsync } from "expo-media-library";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import RecordButton from "./RecordButton";
import RecordIndictor from "./RecordIndicator";
import RecordTimeIndicator from "./RecordTimeIndicator";

const CameraMonitor: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null!);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);

      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;

          await createAssetAsync(data!.uri);
        }
      } catch (error) {
        console.error("Failed to record video:", error);
      }

      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  return (
    <CameraView
      style={styles.camera}
      facing="back"
      videoQuality="720p"
      mode="video"
      ref={cameraRef}
      autofocus="on"
    >
      {isRecording && <RecordIndictor style={styles.indicator} />}
      {isRecording && <RecordTimeIndicator style={styles.time} />}
      <RecordButton
        isRecording={isRecording}
        onRecord={isRecording ? stopRecording : startRecording}
        style={styles.button}
      />
    </CameraView>
  );
};

const styles = StyleSheet.create({
  camera: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  indicator: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  time: {
    position: "absolute",
    top: 10,
    left: "50%",
    transform: [{ translateX: -30 }],
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default CameraMonitor;
