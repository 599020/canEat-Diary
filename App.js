import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRefContext, createStackNavigator } from '@react-navigation/stack';
import StartScanScreen from './screens/StartScanScreen';
import ScannerScreen from "./screens/ScannerScreen";
import { StyleSheet } from 'react-native';
import FrokostScreen from './screens/FrokostScreen';
import DashBoard from './screens/DashBoard';


const Stack = createStackNavigator();

export default function App() {


  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DashBoard">

      <Stack.Screen
          name="DashBoard"
          component={DashBoard}
          options={{ headerShown: false }} // Fjerner overskriften for FrokostScreen
        />
      <Stack.Screen
          name="FrokostScreen"
          component={FrokostScreen}
          options={{ headerShown: false }} // Fjerner overskriften for FrokostScreen
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ headerShown: false }} // Fjerner overskriften for ScannerScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});