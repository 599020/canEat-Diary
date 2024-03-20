import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DeclarationList = ({ declarations }) => {
  const renderItem = ({ item }) => (
    <View style={styles.declarationItem}>
      <Text style={styles.declarationName}>{item.name}</Text>
      <Text style={styles.declarationValue}>{item.value}</Text>
    </View>
  );

  return (
    <FlatList
      data={Object.entries(declarations).map(([name, value]) => ({ name, value }))}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
    />
  );
};

const styles = StyleSheet.create({
  declarationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  declarationName: {
    fontSize: 16,
    
  },
  declarationValue: {
    fontSize: 16,
  },
});

export default DeclarationList;
