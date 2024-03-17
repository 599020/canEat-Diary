import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Image, Text } from 'react-native';

const StartScanScreen = ({ navigation }) => {
  const [productData, setProductData] = useState(null);

  const handleStartScan = () => {
    navigation.navigate("Scanner");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.10.229:8080/data');
        const result = await response.json();
        setProductData(result[0]); // Assuming the response contains only one product
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {productData && (
        <>
          <Image source={{ uri: productData.image }} style={styles.image} />
          <Text style={styles.name}>{productData.name}</Text>
          <Text style={styles.description}>{productData.information}</Text>
        </>
      )}
      <Button title="Scann matvare" onPress={handleStartScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default StartScanScreen;
