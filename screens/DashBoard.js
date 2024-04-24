import React, { useState, useEffect} from 'react';
import { FlatList, View, Image, StyleSheet, TouchableOpacity, TextInput, Text, Button, } from 'react-native';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/ipAdress';
import Icon from '../components/Icon';
import colors from '../config/colors';
import { CameraView, Camera } from 'expo-camera/next';
import * as ImagePicker from 'expo-image-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function DashBoard({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nyttMaal, setNyttMaal] = useState(false);
  const [nyttMaalTittel, setNyttMaalTittel] = useState(null);
  const [nyttMaalKlokke, setNyttMaalKlokke] = useState(null);
  const [dato, setDato] = useState();
  const [dag, setDag] = useState();
  const [formattedDate, setFormattedDate] = useState('');
  const [notat, setNotat] = useState('');
  const [visNotat, setVisNotat] = useState(false);
  const [visKalender, setVisKalender] = useState(false);
  const [utKalender, setUtKalender] = useState(false);
  const[refresh, setRefresh] = useState(false);
  const [maaned, setMaaned] = useState('');

  

  useEffect(() => {
    // Formatere datoen når den endres
    if (dato) {
      const formattedDate = formatDate(dato);
      setFormattedDate(formattedDate);
      const month = new Date(dato).toLocaleDateString('en-GB', { month: 'long' });
      setMaaned(month);
    }
  }, [dato]);


  // Funksjon for å formatere datoen til ønsket format
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  useEffect(() => {
    // Formatere datoen når den endres
    if (dato) {
      const formattedDate = formatDate(dato);
      setFormattedDate(formattedDate);
     


      
    }
  }, [dato]);

  const sortMaaltider = (maaltider) => {
    // Først separerer vi måltidene basert på om de har et klokkeslett eller ikke
    const maaltiderUtenKlokkeslett = maaltider.filter(maaltid => !maaltid.klokkeslett);
    const maaltiderMedKlokkeslett = maaltider.filter(maaltid => maaltid.klokkeslett);
  
    // Sorterer måltidene med klokkeslett etter klokkeslett
    maaltiderMedKlokkeslett.sort((a, b) => {
      const [timeAHours, timeAMinutes] = a.klokkeslett.split(":").map(part => parseInt(part));
      const [timeBHours, timeBMinutes] = b.klokkeslett.split(":").map(part => parseInt(part));
      // Sammenligner timer
      if (timeAHours !== timeBHours) {
        return timeAHours - timeBHours;
      }
      // Sammenligner minutter hvis timer er like
      return timeAMinutes - timeBMinutes;
    });
  
    // Setter opp standard rekkefølge for måltidene uten klokkeslett
    const standardOrder = ["frokost", "lunsj", "middag"];
    maaltiderUtenKlokkeslett.sort((a, b) => {
      return standardOrder.indexOf(a.title.toLowerCase()) - standardOrder.indexOf(b.title.toLowerCase());
    });
  
    // Kombinerer de to sorterte listene
    const sorterteMaaltider = [...maaltiderUtenKlokkeslett, ...maaltiderMedKlokkeslett];
    
    return sorterteMaaltider;
  };



  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        
        setLoading(true);
        try {
          // Første fetch-forespørsel
          const response1 = await fetch(`${API_BASE_URL}/readMaaltider/${dag}/${dato}`);
          const result1 = await response1.json();
          

          const sortedMaaltider = sortMaaltider(result1);
          
  
          setDato(result1[0].idDato);
          setProductData(sortedMaaltider);
          setDag();
          
          
          
          // Andre fetch-forespørsel
          
          const response2 = await fetch(`${API_BASE_URL}/readNotat/${dag}/${dato}`);
          const result2 = await response2.json();
         
          setNotat(result2.notat);
          
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
    }, [nyttMaal, refresh, utKalender])
  );

  

  

  const handleNyttMaaltid = async () => {
   
    try {
      const nyttMaaltidData = {
        title: nyttMaalTittel,
        klokkeslett: nyttMaalKlokke,
        bilde: imageUri,  
        idDato: dato
      };
  
      const response = await fetch(`${API_BASE_URL}/addMeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nyttMaaltidData)
      });
  
      if (response.ok) {
        console.log("nytt måltid lagt til")
      } else {
        console.error('Feil ved opprettelse av nytt måltid:', response.status);
      }
    } catch (error) {
      console.error('Feil ved håndtering av forespørsel:', error);
    }

    setNyttMaal(false);
    setNyttMaalKlokke(null);
    setNyttMaalTittel(null);
  };

  const handleMaaltidPress = (maaltidId) => {
    navigation.navigate("FrokostScreen", { maaltidId });
  };

  // Anta at du har denne funksjonen som navigerer til Statistics-skjermen
const handleStatisticPress = () => {
  // Send formattedDate som en parameter til Statistics-skjermen
  navigation.navigate("Statistics", { dato: dato });
};
  


  // Funksjon for å åpne kameraet og ta et bilde
const openCamera = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  
  if (status === 'granted') {
    const photo = await ImagePicker.launchCameraAsync();
    const uri = photo.assets[0].uri
    if (!photo.canceled) {
      setImageUri(uri);
    }
  } else {
    // Håndter tilfeller der tillatelse ikke er gitt
  }
};


const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === 'granted') {
    const photo = await ImagePicker.launchImageLibraryAsync();
    const uri = photo.assets[0].uri
   
    if (!photo.canceled) {
      setImageUri(uri);
    }
  } else {
    // Håndter tilfeller der tillatelse ikke er gitt
  }
};


const oppdaterNotat = async (nyttNotat) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateNotat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dato, notat: nyttNotat })
    });

    if (response.ok) {
      console.log("Notatet er oppdatert");
    } else {
      console.error('Feil ved oppdatering av notat:', response.status);
    }
  } catch (error) {
    console.error('Feil ved håndtering av forespørsel:', error);
  }
};

// Oppdaterer notatet når endringene blir gjort av brukeren
const handleNotatEndring = (nyttNotat) => {
  setNotat(nyttNotat); // Oppdaterer notatet lokalt
  oppdaterNotat(nyttNotat); // Sender notatendringen til databasen
};


const handleSeNotat = () => {
  setVisNotat(prevState => !prevState);

  // Vis notatet når knappen trykkes
};







  return (
    

    
    <View style={styles.container}>
      <GestureHandlerRootView>
      <Icon name="apple-keyboard-control"  style={styles.kalender}  onPress={() => setVisKalender(true)}/>
      <Icon name="apple-keyboard-control"  style={styles.left}  onPress={() => {setDag("2"); setRefresh(prevState => !prevState);}}/>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
      <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
      <Icon name="apple-keyboard-control" style={styles.right} onPress={() => {setDag("1"); setRefresh(prevState => !prevState);}}/>
      <Text style = {styles.text}>Din dagbok</Text>
      <Text style = {styles.text2}>Måltider for idag</Text>
      <Text style = {styles.text3}>{formattedDate}</Text>
      <Text style = {{fontFamily: "Roboto", left: 20}}>{maaned}</Text>
      </GestureHandlerRootView>
      
      <GestureHandlerRootView>

      <View style={styles.horizontalLine} />
      <View style={styles.viewFlatList}>
        <FlatList 
          initialNumToRender={100}
          maxToRenderPerBatch={100}
          data={productData}
          keyExtractor={maaltid => maaltid.id}
          renderItem={({ item}) => (
            <ListItem
              title={item.title}
              klokkeslett ={item.klokkeslett}
              image={item.bilde}
              onPress={() => handleMaaltidPress(item)}
              icon={item.icon}
              style={{width:"100%"}}
              
            />
          )}
          style={{ width: "90%", }}
        />
      </View>
      </GestureHandlerRootView>

      <View style={styles.absoluteContainer}>
        <ListItem
          title="Legg til nytt Måltid"
          onPress={() => setNyttMaal(true)}
          icon="plus"
          style={styles.absoluteItem}
        />
      </View>

      <TouchableOpacity style={styles.seNotatButton} onPress={handleSeNotat}>
        <Text style={styles.seNotatButtonText}>Se Notat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.seStatistikkButton} onPress={handleStatisticPress}>
        <Text style={styles.seNotatButtonText}>Se Statistikk</Text>
      </TouchableOpacity>

      {nyttMaal &&
        <View style={styles.containerProdukt}>
          <Icon name="apple-keyboard-control" onPress={() => (setNyttMaal(false))} style={styles.back}/>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
          <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
          
          <TextInput
            style={{ fontSize: 20, alignSelf: "center" }}
            value={nyttMaalTittel}
            onChangeText={setNyttMaalTittel}
            placeholder="Skriv inn Tittel på måltid"
          />
          <TextInput
            style={{ marginTop: 20, fontSize: 22, alignSelf: "center" }}
            value={nyttMaalKlokke}
            onChangeText={setNyttMaalKlokke}
            placeholder="Skriv inn klokkeslett"
          />
          <ListItem
            title="Legg til nytt Måltid"
            onPress={handleNyttMaaltid}
            icon="plus"
            style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
          />

          <View style = {{top: 60}}>

          <ListItem style={{height: 50, width: 150, alignSelf: "center", }} title={"Ta bilde"} icon={"camera"} onPress={openCamera}></ListItem>
          <Text style={{fontFamily:"Roboto", alignSelf: "center"}}>eller</Text>
          <ListItem style={{height: 50, width: 150, alignSelf: "center", }} title={"Hent fra kamerarull"} icon={"camera-image"} onPress={pickImage}></ListItem>
          </View>
          {imageUri && <View style={{position: "absolute", alignSelf: "center", bottom: 160, }}>
          <Text style={{fontFamily:"Roboto", alignSelf: "center"}}>Bruk dette eller finn et nytt!</Text>
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          
          </View>}

          
          

        </View>
      }

      {visNotat && (
        <View style={styles.notatContainer}>
          <Text style={styles.notatHeaderText}>Notat</Text>
          <Icon name="apple-keyboard-control" onPress={ (handleSeNotat)} style={{ bottom: 40, transform: [{ rotate: '270deg' }], right: 160, bottom: 200}}/>
          <TextInput
            style={styles.notatTextInput}
            multiline={true}
            value={notat}
            onChangeText={handleNotatEndring}
          />
        </View>
      )}

{visKalender && (
  <View style={styles.notatContainer}> 
  <Calendar
    onDayPress={day => {
      setDato(day.dateString);
      setUtKalender(prevState => !prevState);
      setTimeout(() => {
        // Kode som skal utføres etter forsinkelsen
        setVisKalender(false);
      }, 900);
    }}
  />
</View>
)}
      
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  selectedImage:{
    height: 220,
    width: 180,
    borderRadius: 10,
    borderWidth:2,
    borderColor: colors.medium

  },
  viewFlatList: {
    left: 30,
    width: 300,
    alignItems: "center",
    marginTop: 155,
    height: 300,
    
    borderColor: colors.border,
    borderRadius: 10,
    height: 275 
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
  containerProdukt: {
    flex: 1,
    backgroundColor: "white",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  absoluteContainer: {
    position: 'absolute',
    bottom: 115,
    alignSelf: 'center',
    width: "75%",
  },
  absoluteItem: {
    alignSelf: 'center',
    top: 30,
  },
  back:{
    position: "absolute",
    marginTop: 150,
    left: 10,
    transform: [{ rotate: '270deg' }]
  },
  text:{
    color: colors.skrift,
    fontSize: 28,
    fontFamily: "Roboto",
    fontWeight: "700",
    position: "absolute",
    top: 120,
    alignSelf: "center"
  },
  text2:{
    color: colors.skrift,
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "700",
    position: "absolute",
    top: 260,
    alignSelf: "center"
  },
  text3:{
    color: colors.skrift,
    fontSize: 28,
    fontFamily: "Roboto",
    fontWeight: "700",
    position: "absolute",
    top: 200,
    alignSelf: "center"
  },
  right:{
    position: "absolute",
    top: 200,
    right: 20,
    transform: [{ rotate: '90deg' }]


  },
  left:{
    position: "absolute",
    top: 200,
    left: 20,
    transform: [{ rotate: '270deg' }]
    
    
  },
  kalender:{
    position: "absolute",
    top: 120,
    left: 20,
    transform: [{ rotate: '270deg' }]
  },
  seNotatButton: {
    alignSelf:"center",
    marginTop: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.light,
    borderRadius: 5,
    right: 100
  },
  seStatistikkButton: {
    alignSelf:"center",
    marginTop: -40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.light,
    borderRadius: 5,
    left: 50, 
  },
  seNotatButtonText: {
    color: colors.medium,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Stiler for visningsområdet for notatet
  notatContainer: {
    backgroundColor: colors.white,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    height: "85%",
    bottom: 0,
    paddingHorizontal: 20, // Legg til litt mellomrom på sidene
    paddingTop: 20, // Legg til litt mellomrom øverst
  },
  notatHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center" // Legg til litt mellomrom under overskriften
  },
  notatTextInput: {
    fontSize: 18, // Øk skriftstørrelsen
    color: colors.dark,
    textAlignVertical: "top",
    height: 450,
    borderWidth: 1, // Legg til ramme rundt tekstboksen
    borderColor: colors.medium,
    borderRadius: 10, // Runde hjørner
    paddingHorizontal: 10,
     // Legg til litt mellomrom på sidene inne i tekstboksen
  },
  horizontalLine: {
    borderBottomColor: colors.medium,
    borderBottomWidth: 1,
    width: '80%',
    top: 145,
    alignSelf: "center"
    
    
  },
});
