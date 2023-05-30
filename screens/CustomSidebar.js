import React, { Component } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// DrawerContentScrollview is used to render the menu items within the drawer,it is passed the props object so that it can accese the navigation state and function
//DraweritemList is used to render the individual menu items
import {
  DrawerContentScrollView,
  DrawerItemList
} from "@react-navigation/drawer";

export default class CustomSidebarMenu extends React.Component{
 
  render(){
 

    return(
      <View style={{flex:1,background:"#770737"}}>
      <Image source={require("../assets/icon.png")}
      style={{ width:100,
      height:100,
      resizeMode:"contain",
      justifyContent:"center",
      alignItems:"center",
      borderRadius: RFValue(70),
      alignSelf: "center",
      marginTop: RFValue(40),
    }}/>
      <DrawerContentScrollView {...this.props}>
      <DrawerItemList{...this.props}/>
      </DrawerContentScrollView>
      </View>
    )
  }
}