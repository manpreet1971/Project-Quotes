//selet picture function it requests the permission to access the media liberary
//if the permission is granted then it automatically launch the ImagePicker.
//{image ..}  it is a javascript conditional rendering statement and this expression xhecks whether the image variable is tue or not.if that is true then the code is rendered with the specified source and style.
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import { ViewPropTypes } from "deprecated-react-native-prop-types";
import db from "../config";

import { ref, set, auth } from "firebase/database";
let customFont = {
  NatureBeauty: require("../assets/font/NatureBeauty.ttf"),
};
export default class App extends React.Component {
  state = {
    image: null,
    fontLoaded: "false",
    topic: " ",
    quote: " ",
    author: " ",
    count: 0,
    name: "",
  };

  async loadFont() {
    await Font.loadAsync(customFont);
    this.setState({ fontLoaded: "true" });
  }
  componentDidMount() {
    this.loadFont();
    this.userAdd();
  }
  selectPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to pick an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    //the user can select an image from the gallery and if it is not canceled automatically we are displaying the image and trickering the re render to
    if (!result.canceled) {
      this.setState({ image: result.uri });
    }
  };

  async userAdd() {
    let theme, name, image;
    const topicCountRef = ref(db, "users/" + auth.currentUser.uid);
    onValue(topicCountRef, (snapshot) => {
      theme = snapshot.val().current_theme;
      name = snapshot.val().first_name + snapshot.val().second_name;
    });
    this.setState({
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
      name: name,
    });
    console.log(this.state.name);
  }
  async add() {
    if (this.state.topic && this.state.quote && this.state.author) {
      this.setState({
        count: this.state.count + 1,
      });
      console.log("called");
      let data = {
        author: this.state.author,
        quote: this.state.quote,
        presentedBy: auth.currentUser.displayName,
        added_on: new Date(),
        presenter_uid: firebase.auth().currentUser.uid,
        likes: 0,
        image: this.state.image,
      };
      set(ref(db, "/topics/" + this.state.topic + "/quote " + this.state.count + "/"), {
       data
      });
     
      Alert.alert("Quote Published");
      alert("Quote Published");
    } else {
      Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

  render() {
    const { image } = this.state;
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <ScrollView>
            <View style={styles.title}>
              <View style={styles.iconCon}>
                <Image
                  source={require("../assets/icon.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.titleText}> Add Quote</Text>
            </View>

            <View
              style={{ flex: 0.99, top: RFValue(-10), alignItems: "center" }}
            >
              {image && <Image source={{ uri: image }} style={styles.image} />}
              <TouchableOpacity
                onPress={this.selectPicture}
                style={styles.butImage}
              >
                <Text style={styles.butext}>Pick Image</Text>
              </TouchableOpacity>
              <View>
                <TextInput
                  onChangeText={(topic) =>
                    this.setState({ topic: topic.toLowerCase() })
                  }
                  placeholder={"Topic(eg.Courage)"}
                  style={styles.input}
                />
                <TextInput
                  onChangeText={(quote) => this.setState({ quote: quote })}
                  placeholder={"Quote"}
                  multiline={true}
                  numberOfLines={4}
                  style={styles.input}
                />
                <TextInput
                  onChangeText={(author) => this.setState({ author: author })}
                  placeholder={"Author"}
                  multiline={true}
                  numberOfLines={4}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.add();
                    this.props.navigation.navigate("Home");
                  }}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.99 }}>
                <Text style={{ marginTop: 50 }}>hello</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#301934",
  },
  image: {
    width: RFValue(300),
    height: RFValue(300),
    resizeMode: "contain",
    top: -70,
    marginBottom: RFValue(-120),
    marginTop: -40,
  },
  title: {
    flex: 0.99,
    flexDirection: "row",
  },
  titleText: {
    fontFamily: "NatureBeauty",
    fontSize: 35,
    color: "#F6E7E1",
  },
  iconCon: {
    flex: 0.97,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  butImage: {
    backgroundColor: "#F6E7E1",
    width: RFValue(120),
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
  },
  input: {
    backgroundColor: "#FAF085",
    width: RFValue(250),
    height: RFValue(40),
    borderRadius: RFValue(80),
    paddingLeft: 20,
    fontSize: RFValue(30),
    fontFamily: "Freestyle Script",
    marginTop: RFValue(20),
  },
  buttonText: {
    color: "#301934",
    fontFamily: "NatureBeauty",
    fontSize: RFValue(30),
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  button: {
    backgroundColor: "#F6E7E1",
    marginTop: RFValue(20),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(80),
    width: RFValue(150),
    marginLeft: RFValue(50),
  },
  butext: {
    color: "#301934",
    fontFamily: "NatureBeauty",
    fontSize: RFValue(20),
  },
});
