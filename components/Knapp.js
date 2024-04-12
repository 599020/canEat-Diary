import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppText from './AppText'

export default function Knapp({children, style, onPress}) {
  return (
   <TouchableOpacity onPress={onPress}>
    <View style = {style} >
        <Text>{children}</Text>
    </View>
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})