import {Text, View,} from 'react-native'
import React from 'react'


export default function AppText({ children, style }) {
  return (
    
      <Text style={style}>{children}</Text>
    
  )
}