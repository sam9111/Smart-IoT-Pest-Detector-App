import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { FontAwesome5 } from "@expo/vector-icons";
import Spacer from "react-native-spacer";
import { API_TOKEN } from "@env";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

export default function App() {
  const api_token = API_TOKEN;

  const handleButtonPress = (direction) => {
    let update_url =
      "https://blynk.cloud/external/api/update?token=" + api_token;
    switch (direction) {
      case "left":
        pin = "v0";
        value = "1";
        break;
      case "right":
        pin = "v1";
        value = "1";
        break;
      case "forward":
        pin = "v2";
        value = "1";
        break;
    }

    update_url = update_url + "&pin=" + pin + "&value=" + value;

    fetch(update_url)
      .then((response) => {
        if (!response.ok) {
          console.log("POST ERROR: " + JSON.stringify(response));
          throw new Error("HTTP error " + response.status);
        }
        console.log("POST RESPONSE: " + JSON.stringify(response));

        Toast.show("Moved " + direction + " successfully", {
          position: Toast.positions.CENTER,
        });
      })
      .catch((error) => {
        Toast.show("Error: " + error.message, {
          position: Toast.positions.CENTER,
        });
      });
  };

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={styles.webViewContainer}>
          <WebView
            style={styles.webView}
            originWhitelist={["*"]}
            source={{
              html: "<div style='background-color: gray; height: 100%; width: 100%;'></div>",
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("forward")}
          >
            <MaterialIcons name="keyboard-arrow-up" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("left")}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("right")}
          >
            <MaterialIcons name="keyboard-arrow-right" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <Spacer height={32} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rectButton}>
            <FontAwesome5 name="spray-can" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rectButton}>
            <FontAwesome5 name="camera" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webViewContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginBottom: 16,
  },
  webView: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 50,
    padding: 16,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rectButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "blue",
    borderRadius: 10,
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    padding: 8,
  },
});
