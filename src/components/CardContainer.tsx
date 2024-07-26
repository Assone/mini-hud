import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface CardContainerProps {}

const CardContainer: React.FC<PropsWithChildren<CardContainerProps>> = ({
  children,
}) => {
  return <View style={[styles.container]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f1f1f1",
    shadowColor: "#000",
  },
});

export default CardContainer;
