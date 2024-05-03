import { ImageBackground, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import { MaterialCommunityIcons} from "@expo/vector-icons";

export default function Icon({ name, onPress, style }) {
    return (
      

    
      <View style={style}>
  
      <TouchableWithoutFeedback onPress={onPress} >
        <View >
          <MaterialCommunityIcons 
            name={name}
            size={35}
            color={colors.skrift}
            />
        </View>
          
      </TouchableWithoutFeedback>
      </View>
    
    );
  }

