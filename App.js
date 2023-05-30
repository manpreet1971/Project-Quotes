import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import ThankYou from "./screens/ThankYou";

import DrawerNavigator from "./navigation/DrawerNavigator";
import db from './config';

const Stack = createStackNavigator();

const StackNav = () => {
  return(
  <Stack.Navigator initialRouteName="Dashboard"  screenOptions={{
    headerShown: false,
    gestureEnabled: false
  }}>
   
    <Stack.Screen name="Login" component={LoginScreen}/>
    <Stack.Screen name="Register" component={RegisterScreen}/>
    <Stack.Screen name="ThankYou" component={ThankYou}/>
    <Stack.Screen name="Dashboard" component={DrawerNavigator} />
  </Stack.Navigator>)
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNav/>
    </NavigationContainer>)

}



