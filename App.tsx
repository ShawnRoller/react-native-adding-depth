import "react-native-gesture-handler";
import * as React from "react";
import { Text, View, StyleSheet, Pressable, Dimensions } from "react-native";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";

import Begin from "./screens/begin";
import Final from "./screens/final";

export default function App() {
  const [useFinal, setUseFinal] = React.useState(true);

  const title = useFinal ? "Animations: Engaged" : "Animations: Disengaged";

  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      {useFinal ? <Final /> : <Begin />}
      <View style={styles.tabContainer}>
        <Pressable onPress={() => setUseFinal(false)}>
          <FontAwesome
            name="thumbs-o-down"
            size={24}
            color={useFinal ? "gray" : "blue"}
          />
        </Pressable>
        <FontAwesome name="heart" size={24} color="red" />
        <Pressable onPress={() => setUseFinal(true)}>
          <FontAwesome
            name="thumbs-o-up"
            size={24}
            color={useFinal ? "blue" : "gray"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  tabContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    start: 0,
    end: 0,
    height: 60,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
