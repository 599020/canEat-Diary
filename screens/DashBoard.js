import React, { useState } from 'react';
import { FlatList, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';

const images = {
  frokost: require("../assets/frokost.png"),
  lunsj: require("../assets/lunsj.png"),
  middag: require("../assets/middag.png"),
};



export default function DashBoard({ navigation }) {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://172.20.10.3:8080/data');
          const result = await response.json();
          setProductData(result.maaltid.maaltider);
           // Antar at responsen inneholder bare ett produkt
        } catch (error) {
          console.error('Feil ved henting av produktdata:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        // Rens opp eller fjern eventuelle abonnementer når komponenten er fjernet fra skjermen
      };
    }, [])
  );

  


  const handleMaaltidPress = (maaltidId) => {
    navigation.navigate("FrokostScreen", { maaltidId });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
      <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
      <View style={styles.viewFlatList}>
        <FlatList 
          data={productData}
          keyExtractor={maaltid => maaltid.id}
          renderItem={({ item }) => (
            
              <ListItem
                title={item.title}
                klokkeslett={item.klokkeslett}
                image={item.bilde}
                onPress={() => handleMaaltidPress(item)}
                icon={item.icon}
              />
            
          )}
          style={{ width: "100%" }}
        />
      </View>

      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  viewFlatList: {
    marginLeft: 50,
    width: "100%",
    alignItems: "center",
    marginTop: 200,
  },
  logo: {
    marginLeft: 100, 
    width: 200, 
    height: 150, 
    resizeMode: "contain"
  },
  heimIcon: {
    position: 'absolute',
    left: 10,
    top: 50,
    width: 50, 
    height: 50,
  },
  profilIcon: {
    position: 'absolute',
    right: 10,
    top: 50,
    width: 50, 
    height: 50,
  },
});
