import { StyleSheet, View, Image, FlatList, Button, Alert, Text, TextInput } from 'react-native';
import React, { useState, useEffect,} from 'react';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from '../config/colors';
import {API_BASE_URL } from '../config/ipAdress'

const FrokostScreen = ({ navigation, route }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const maaltidId = route.params ? route.params.maaltidId : null;
  const [maaltidTittel, setMaaltidTittel] = useState(); 
  const [maaltidKlokke, setMaaltidKlokke] = useState(); 
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingKlokke, setEditingKlokke] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newKlokke, setNewKlokke] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);


  //funksjon for å sende videre til scanner
  const handleStartScan = () => {
    navigation.navigate("Scanner", {maaltidId} );
  };

  const handleBack = () =>{
    navigation.navigate("DashBoard");
  }


  // funksjon for å si til backend å slette det gitte item og oppdatere productData
  const handleDeleteItem = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sletteVare`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item) // Hele objektet sendes til serveren
      });
      if (response.ok) {
        // Oppdaterer produktdata ved å fjerne det slettede elementet
        setProductData(prevData => prevData.filter(product => product._id !== item._id));
      } else {
        // Viser en feilmelding dersom slettingen mislykkes
        Alert.alert('Feil', 'Kunne ikke slette varen. Vennligst prøv igjen.');
      }
    } catch (error) {
      console.error('Feil ved sletting av produkt:', error);
      Alert.alert('Feil', 'Noe gikk galt. Vennligst prøv igjen.');
    }
  };

  // Funksjon for å bekrefte den nye tittelen
  const confirmNewTitle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/endreMaaltidInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maaltidId: maaltidId.id,
          maaltidDato: maaltidId.idDato,
          newTitle: newTitle
        })
      });
      if (response.ok) {
        // Oppdaterer skjermen ved å endre refreshFlag
        setRefreshFlag(prevFlag => !prevFlag);
      } else {
        Alert.alert('Feil', 'Kunne ikke oppdatere tittelen. Vennligst prøv igjen.');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av tittel:', error);
      Alert.alert('Feil', 'Noe gikk galt. Vennligst prøv igjen.');
    }
    setEditingTitle(false); // Avslutter redigeringsmodus uansett resultatet av oppdateringen
  };

  // Funksjon for å bekrefte den nye klokkesletten
  const confirmNewKlokke = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/endreMaaltidInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maaltidId: maaltidId.id,
          maaltidDato: maaltidId.idDato,
          newKlokke: newKlokke

        })
      });
      if (response.ok) {
        // Oppdaterer skjermen ved å endre refreshFlag
        setRefreshFlag(prevFlag => !prevFlag);
      } else {
        Alert.alert('Feil', 'Kunne ikke oppdatere klokkeslettet. Vennligst prøv igjen.');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av klokkeslett:', error);
      Alert.alert('Feil', 'Noe gikk galt. Vennligst prøv igjen.');
    }
    setEditingKlokke(false); // Avslutter redigeringsmodus uansett resultatet av oppdateringen
  };



  // denne refresher og legger in data i productData som listet lenger nede. 
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const maaltidID = maaltidId.id.toString();
        const datoID = maaltidId.idDato.toString();
        console.log(maaltidID);
        console.log(datoID);
        try {
          const response = await fetch(`${API_BASE_URL}/readProdukter/${maaltidID}/${datoID}`);
          const resultat = await response.json();
          const result = resultat.maaltid;
          
          
          
          setProductData(result.produkter);
          setMaaltidTittel(result.title);
          setMaaltidKlokke(result.klokkeslett);
        } catch (error) {
          console.error('Feil ved henting av produktdata:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        // Clean up any subscriptions or effects when the component is unmounted
      };
    }, [maaltidId, refreshFlag])
  );


  return (
    <View style={styles.container}>
      <Icon name="arrow-left-bold" onPress={() => (handleBack)} style={styles.back}/>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
      <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
      {editingTitle ? (
        <TextInput
          value={newTitle}
          onChangeText={setNewTitle}
          onBlur={confirmNewTitle}
          autoFocus
          style={styles.info}
        />
      ) : (
        <Text style={styles.info} onPress={() => setEditingTitle(true)}>
          {maaltidTittel}
          <Icon name="pencil" style={styles.editIcon}/>
        </Text>
      )}

      {editingKlokke ? (
        <TextInput
          value={newKlokke}
          onChangeText={setNewKlokke}
          onBlur={confirmNewKlokke}
          autoFocus
          style={styles.klokke}
        />
      ) : (
        <Text style={styles.klokke} onPress={() => setEditingKlokke(true)}>
          Kl: {maaltidKlokke}
          <Icon name="pencil" style={styles.editIcon}/>
        </Text>
      )}
      
      <Text style={styles.productHeader}>Produkter</Text>
      <View style={styles.horizontalLine} />
      <View style={styles.viewFlatList}>
        <FlatList
          data={productData}
          keyExtractor={product => product._id}
          renderItem={({ item }) =>
            <ListItem
              title={item.productName}
              subTitle={item.angittMengde}
              image={item.image}
              onPress={() => handleDeleteItem(item)}
              icon={"trash-can"} // Legger til handleDeleteItem-funksjonen her
            />
          }
          style={{ width: "100%" }}
        />
      </View>
        
      <ListItem icon="plus" title="Scann matvare" onPress={handleStartScan} style={{marginTop: 700, marginLeft: 50, position:"absolute"}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignContent: "center"
  },
  viewFlatList: {
    marginLeft: 50,
    width: "100%",
    alignItems: "center",
    marginTop: 20, // Redusert fra 100 til 20 for bedre utseende
    height: 400
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
  back:{
    position: "absolute",
    marginTop: 150,
   
  },
  info:{
    position:"absolute",
    marginTop: 150,
    alignSelf: "center",
    color: colors.skrift,
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "700",
    flexDirection: "row",
    // Legg til for å tillate side-ved-side plassering av tekst og ikon
  },
  klokke:{
    position:"absolute",
    marginTop: 185,
    alignSelf: "center",
    color: colors.skrift,
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "700",
    flexDirection: "row",
    // Legg til for å tillate side-ved-side plassering av tekst og ikon
  },
  productHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 130,
    marginLeft: 50,
    left: 100,
    
  },
  horizontalLine: {
    borderBottomColor: colors.medium,
    borderBottomWidth: 1,
    width: '75%',
    marginLeft: 50,
    marginTop: 5,
    
  },
  editIcon: {
    
  
    
  },
 });

export default FrokostScreen;
