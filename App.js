import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Image,
} from "react-native";

import { WebView } from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { FontAwesome5 } from "@expo/vector-icons";
import Spacer from "react-native-spacer";
import { API_TOKEN } from "@env";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const updateApi = async (pin, value, success_message) => {
  const api_token = API_TOKEN;
  let update_url = "https://blynk.cloud/external/api/update?token=" + api_token;
  update_url = update_url + "&pin=" + pin + "&value=" + value;

  await fetch(update_url)
    .then((response) => {
      if (!response.ok) {
        console.log("POST ERROR: " + JSON.stringify(response));
        throw new Error("HTTP error " + response.status);
      }
      console.log("POST RESPONSE: " + JSON.stringify(response));

      if (success_message != "") {
        Toast.show(success_message, {});
      }
    })
    .catch((error) => {
      Toast.show("Error: " + error.message, {});
    });
};

const updateMultipleApi = async (pins, values, success_message) => {
  const api_token = API_TOKEN;
  let update_url = "https://blynk.cloud/external/api/update?token=" + api_token;

  for (let i = 0; i < pins.length; i++) {
    update_url = update_url + "&" + pins[i] + "=" + values[i];
  }

  await fetch(update_url)
    .then((response) => {
      if (!response.ok) {
        console.log("POST ERROR: " + JSON.stringify(response));
        throw new Error("HTTP error " + response.status);
      }
      console.log("POST RESPONSE: " + JSON.stringify(response));

      Toast.show(success_message, {});
    })
    .catch((error) => {
      Toast.show("Error: " + error.message, {});
    });
};

export default function App() {
  const [transform, setTransform] = React.useState({ rotate: "0deg" });
  const [cameraFeed, setCameraFeed] = React.useState(false);
  const [diseased, setDiseased] = React.useState(null);
  const [showBanner, setShowBanner] = React.useState(null);

  const updatePin = (direction) => {
    switch (direction) {
      case "left":
        pin = "v0";
        value = "1";
        setTransform({ rotateY: "180deg" });
        break;
      case "right":
        pin = "v1";
        value = "1";
        setTransform({ rotateY: "0deg" });
        break;
      case "forward":
        pin = "v2";
        value = "1";
        setTransform({ rotate: "270deg" });
        break;
      case "camera left":
        pin = "v5";
        value = "1";
        break;
      case "camera right":
        pin = "v6";
        value = "1";
        break;
    }

    updateApi(pin, value, "Moved " + direction + " successfully");
  };

  const updateDiseased = async () => {
    // sleep for 5 seconds

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const status = await fetch(
      "https://blynk.cloud/external/api/get?token=" + API_TOKEN + "&v9"
    )
      .then((response) => {
        if (!response.ok) {
          console.log("GET ERROR: " + JSON.stringify(response));
          throw new Error("HTTP error " + response.status);
        }
        console.log("GET RESPONSE: " + JSON.stringify(response));
        return response.json();
      })
      .catch((error) => {
        console.log("GET ERROR: " + error.message);
        Toast.show("Error: " + error.message, {});
      });

    console.log("PLANT STATUS: " + status);

    if (status == 0) {
      setDiseased(true);
    } else {
      setDiseased(false);
    }

    // show banner for 5 seconds
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
    }, 5000);
  };

  return (
    <RootSiblingParent>
      <ScrollView style={styles.container}>
        <Spacer height={32} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Live Video Feed
        </Text>
        <View style={styles.webViewContainer}>
          <View
            style={{
              position: "absolute",
              padding: 16,
              left: 0,
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: 50,
              opacity: 0.5,
              margin: 8,
            }}
          >
            <TouchableOpacity onPress={() => updatePin("camera left")}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              padding: 16,
              right: 0,
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: 50,
              opacity: 0.5,
              margin: 8,
            }}
          >
            <TouchableOpacity onPress={() => updatePin("camera right")}>
              <AntDesign name="arrowright" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              padding: 16,
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: 50,
              opacity: 0.5,
              margin: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                updateApi("v5", "0", "");
                updateApi("v6", "0", "");
              }}
            >
              <AntDesign name="arrowup" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <WebView
            style={styles.webView}
            originWhitelist={["*"]}
            source={{
              uri: "http://192.168.1.38:8000",
            }}
          />

          <View
            style={{
              position: "absolute",
              padding: 16,
              bottom: 0,
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: 50,
              opacity: 0.5,
              margin: 8,
            }}
          >
            {cameraFeed ? (
              <TouchableOpacity
                onPress={() => {
                  setCameraFeed(false);
                  updateApi("v7", "0", "Feed stopped");
                }}
              >
                <Entypo name="controller-stop" size={30} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCameraFeed(true);
                  updateApi("v7", "1", "Feed started");
                }}
              >
                <AntDesign name="caretright" size={30} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Spacer height={32} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePin("forward")}
          >
            <MaterialIcons name="keyboard-arrow-up" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePin("left")}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="#fff" />
          </TouchableOpacity>

          <View
            style={{
              padding: 16,
              marginHorizontal: 8,
              transform: [transform],
            }}
          >
            <MaterialCommunityIcons
              name="robot-mower-outline"
              size={40}
              color="black"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePin("right")}
          >
            <MaterialIcons name="keyboard-arrow-right" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <Spacer height={32} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rectButton}
            onPress={() => updateApi("v4", "1", "Sprayed successfully")}
          >
            <FontAwesome5 name="spray-can" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rectButton}
            onPress={() => {
              setCameraFeed(false);
              updateApi("v8", "1", "Captured successfully");
              updateDiseased();
            }}
          >
            <FontAwesome5 name="camera" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {showBanner && (
          <View
            style={{
              backgroundColor: diseased ? "red" : "green",
              padding: 16,
              borderRadius: 8,
              margin: 16,
            }}
          >
            <Text style={{ color: "white" }}>
              {diseased ? "Diseased plant detected" : "Healthy plant detected"}
            </Text>
          </View>
        )}

        <StatusBar style="auto" />
      </ScrollView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 8,
  },
  webViewContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  webView: {
    height: 300,
    width: "100%",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
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
    borderRadius: 12,
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
});
