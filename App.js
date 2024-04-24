import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScanScreen from './screens/StartScanScreen';
import ScannerScreen from "./screens/ScannerScreen";
import FrokostScreen from './screens/FrokostScreen';
import DashBoard from './screens/DashBoard';
import StatisticsScreen from './screens/StatisticsScreen';

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
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ headerShown: false, title: 'Statistics' }} // You can customize your header options
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
