import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import { usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

interface PermissionResponse {
  granted: boolean;
}

type Hooks = () => [
  permission: PermissionResponse | null,
  requestPermission: () => Promise<PermissionResponse>
];

interface EnsurePermissionProps {
  fallback: (
    requestPermission: () => Promise<PermissionResponse>
  ) => React.ReactNode;
}

const createPermissionComponent =
  (hooks: Hooks) => (props: PropsWithChildren<EnsurePermissionProps>) => {
    const [permission, requestPermission] = hooks();

    if (!permission) {
      return <View />;
    }

    if (!permission.granted) {
      return props.fallback(requestPermission);
    }

    return props.children;
  };

export const EnsureCameraPermission = createPermissionComponent(() => {
  const [permission, requestPermission] = useCameraPermissions();

  return [permission, requestPermission];
});

export const EnsureMicrophonePermission = createPermissionComponent(() => {
  const [permission, requestPermission] = useMicrophonePermissions();

  return [permission, requestPermission];
});

export const EnsureLocationPermission = createPermissionComponent(() => {
  const [permission, requestPermission] = useForegroundPermissions();

  return [permission, requestPermission];
});

export const EnsureMediaLibraryPermission = createPermissionComponent(() => {
  const [permission, requestPermission] = useMediaLibraryPermissions();

  return [permission, requestPermission];
});
