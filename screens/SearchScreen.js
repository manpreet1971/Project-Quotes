import * as React from "react";
import { Text, View, StyleSheet, Image,FlatList,ScrollView,TouchableOpacity } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import { Picker } from "@react-native-picker/picker";
import db from "../config";
import { ref, onValue } from "firebase/database";
let customFont = {
  NatureBeauty: require("../assets/font/NatureBeauty.ttf"),
};

export default class AddQuotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selected: "",
      items: [],
      selectedValue: "",
      quotes: [],
      count: 0,
    };
  }
  async loadFont() {
    await Font.loadAsync(customFont);
    this.setState({ fontLoaded: true });
  }
  componentDidMount() {
    this.loadFont();
    this.getData();
  }
  getData() {
    const topicCountRef = ref(db, "topics");
    onValue(topicCountRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const data = snapshot.val();

        const items = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
        }));

        this.setState({ items: items });
      }
    });
  }
  handleValueChange = (selectedValue) => {
    const topicCountRef = ref(db, "topics");
    onValue(topicCountRef, (snapshot) =>{
        let quotes = [];
        if (snapshot.val()) {
          // Iterate over the subvalues of the selected topic
          Object.keys(snapshot.val()).forEach((key) => {
            const quoteData = snapshot.val()[key];
            quotes.push({
              id: key,
              author: quoteData.author,
              quote: quoteData.quote,
              image :quoteData.image
            });
          });
        }
        this.setState({ quotes }, () => {
          console.log(this.state.quotes); // Log inside the setState callback
        });
      });
  };

  renderQuoteItem = ({ item }) => {
    console.log(item)
    return (
      <ScrollView>
      <TouchableOpacity onPress={() => this.handleQuotePress(item)}
      style={styles.but}
      >
        <Image source={{uri:item.image}} style={styles.qImg}/>
        <Text style={styles.qText}>Quote:  {item.quote}</Text>
        <Text style={[styles.qText,{marginTop:RFValue(25)}]}>Author: {item.author}</Text>
      </TouchableOpacity>
      </ScrollView>
    );
  };
  render() {
    const { items, selectedValue, quotes } = this.state;
   
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image source={require("../assets/icon.png")} style={styles.icon} />

          <Text style={styles.titleText}> Quote It</Text>
        </View>

        <View style={styles.search}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => this.handleValueChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Topic" value={null} />
            {items.map((item) => (
              <Picker.Item key={item.id} label={item.id} value={item.id} />
            ))}
          </Picker>
        </View>

          <FlatList
            data={quotes}
            renderItem={this.renderQuoteItem}
            keyExtractor={(item) => item.id}
          />
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#301934",
  },
  title: {
    flexDirection: "row",
    marginLeft: -50,
  },
  titleText: {
    fontFamily: "NatureBeauty",
    fontSize: 35,
    color: "#F6E7E1",
    padding: -60,
  },
  iconCon: {
    flex: 0.97,
  },
  icon: {
    width: RFValue(80),
    height: RFValue(80),
    resizeMode: "contain",
  },
  picker: {
    fontFamily: "NatureBeauty",
    width: 100,
    borderRadius: RFValue(35),
    height: 50,
    backgroundColor: "#FAF085",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: RFValue(35),
  },
  search: {
    flex: 4.8,
  },
  but: {
    backgroundColor: "#FFC0CB",
    marginTop: RFValue(25),

    borderRadius: RFValue(78),
    justifyContent: "center",
    alignItems: "center",
    border: "dotted",
  },
  qText: {
    fontFamily: "NatureBeauty",
    fontSize: RFValue(20),
    color: "#301934",
  },
  navigate: {
    backgroundColor: "#FAF085",
  },
  qImg: {
    width: 250,
    height: 150,
    resizeMode: "contain",
    borderRadius: 60,
  },
});
