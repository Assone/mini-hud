import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    const handleOrientationChange: ScreenOrientation.OrientationChangeListener =
      (event) => {
        setOrientation(event.orientationInfo.orientation);
        setScreenDimensions(Dimensions.get("window"));
      };

    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );

    // 初始化方向
    (async () => {
      const initialOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(initialOrientation);
    })();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const isPortrait =
    orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
    orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;

  return {
    orientation,
    isPortrait,
    screenWidth: screenDimensions.width,
    screenHeight: screenDimensions.height,
  };
};

export default useOrientation;
