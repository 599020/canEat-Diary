import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator, Dimensions, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, Camera } from 'expo-camera/next';
import Icon from '../components/Icon';
import colors from '../config/colors';
import ListItem from '../components/ListItem';
import { PageSlider } from '@pietile-native-kit/page-slider';
import DeclarationList from '../components/DeclarationList';




const ScannerScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const maaltidId = route.params ? route.params.maaltidId : null;
  const [selectedPage, setSelectedPage] = useState(0);



  

  

  const handleBack = () =>{
    navigation.navigate("FrokostScreen");
  }

  const IkkeLeggTil = () =>{
    setProductData(null);
  }

  // Får tillatelse fra telefonen til kameraet
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  // Denne blir kalt når kameraet har skannet strekkoden, og sender dataen.
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    setErrorMessage('');
  
    const response = await fetchProductData(data);
    setProductData(response);
    setLoading(false);
      
  };


  const mellomledd = async () =>{
  try{
    await postDataToServer(productData);
    navigation.navigate('FrokostScreen', { maaltidId }); // Navigerer til FrokostScreen
  } catch (error) {
    console.error('Error handling scanned product:', error);
    setErrorMessage('Feil ved behandling av skannet produkt. Vennligst prøv igjen.');
  } 

  }


  const handleManualBarcodeInput = async () => {
    setScanned(true);
    setLoading(true);
    setErrorMessage('');
    if (manualBarcode.trim() === '') {
      setErrorMessage('Vennligst skriv inn en strekkode.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetchProductData(manualBarcode.trim());
      setProductData(response);
      await postDataToServer(response);
      navigation.navigate('FrokostScreen', {maaltidId}); // Navigerer til FrokostScreen
    } catch (error) {
      console.error('Error handling scanned product:', error);
      setErrorMessage('Feil ved behandling av produkt. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };


  // Sender strekkoden til API-et og får varen i JSON returnert
  const fetchProductData = async (data) => {
    const response = await fetch(
      `https://us-central1-can-eat-prod.cloudfunctions.net/products/${data}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          origin: 'caneatbackend'
        }
      }
    );
    const responseData = await response.json();
    return responseData.data.product[0]; // Assuming only one product is returned
  };

  // Denne poster varen til backenden
  const postDataToServer = async (productData) => {
    try {
      productData.maaltidId = maaltidId.id;
      const response = await fetch('http://172.20.10.3:8080/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error('Error posting data to server:', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Begrenser størrelsen på kameraviewet til 70% av skjermens bredde
  const windowWidth = Dimensions.get('window').width;
  const cameraWidth = windowWidth * 0.7;

  return (
    <>
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
      <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
      <Icon name="arrow-left-bold" onPress={() => (handleBack)} style={styles.back}/>


      <Text style = {styles.text}>Scann strekkoden her!</Text>
      <View style={[styles.cameraContainer, { width: cameraWidth }]}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean8', 'ean13'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <Text style = {styles.text2}>eller</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setManualBarcode}
          value={manualBarcode}
          placeholder="Skriv inn strekkoden her"
        />
        <ListItem title="Søk" onPress={handleManualBarcodeInput} style={{height:40, width:150, alignSelf:"center"}} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <>
              {scanned && !loading && (
                <Button title="Trykk for å skanne på nytt" onPress={() => setScanned(false)} />
              )}
            </>
          )}
        </>
      )}
    </View>
    {productData && (

      <View style={styles.containerProdukt}>
       <Image style={{marginLeft: 100, width: 200, height: 150, resizeMode: "contain"}} source={require("../assets/logo.png")} />
       <Image style={styles.heimIcon} source={require("../assets/heimIcon.png")} />
       <Image style={styles.profilIcon} source={require("../assets/profilIcon.png")} />
        <Image style={styles.image} source={{uri : productData.image}} resizeMode="contain" />
        
        <TouchableOpacity onPress={(IkkeLeggTil)}>
        <Image style={{width: 100, height:100, position: "absolute", alignSelf: "center", top: 180}} source={require("../assets/kyssUtIcon.png")} resizeMode="contain" />
        </TouchableOpacity>

        <PageSlider
      style={styles.pageSlider}
      selectedPage={selectedPage}
      onSelectedPageChange={setSelectedPage}
      onCurrentPageChange={(currentpage) => (currentpage) }
      mode='page'
      pageMargin={10}
    >
      <View style={styles.page}>
      <Text style={{fontSize: 20,fontWeight:"bold", top:5, left: 15}}>{productData.name}</Text>
      <View style={styles.divider}></View>
      <Text style={{fontSize: 16,fontWeight:"bold", left: 15}}>Næringsinnhold</Text>
      <DeclarationList declarations={productData.nutriments} />
      <Text></Text>

      </View>
      <View style={styles.page}>
        <Text style={{fontSize: 20,fontWeight:"bold", top:5, left: 15}}>{productData.name}</Text>
        <View style={styles.divider}></View>
        <Text style={{fontSize: 16,fontWeight:"bold", left: 15}}>Ingredienser</Text>
        <Text style={{left: 15, }}>{productData.ingredients}</Text>
      </View>

      <View style={styles.page}>
       <Text style={{fontSize: 20,fontWeight:"bold", top:5, left: 15}}>{productData.name}</Text>
       <View style={styles.divider}></View>
       <Text style={{fontSize: 16,fontWeight:"bold", left: 15}}>Allergener</Text>
       <DeclarationList declarations={productData.allergens} />
       <Text></Text>
      </View>
    </PageSlider>

        
        
        
        <ListItem 
            style={styles.leggTil}
            title="Legg til produkt!" 
            onPress={(mellomledd)}
            icon={"plus"} // Legger til handleDeleteItem-funksjonen her
            />
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "white"
  },
  cameraContainer: {
    borderWidth: 4,
    borderColor: 'black',
    overflow: 'hidden',
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 150
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  back:{
    position: "absolute",
    top: 120,
    left: 20,
    
  },
  logo: {
    marginLeft: 10,
    width: 200,
    height: 150,
    resizeMode: "contain"
  },
  heimIcon: {
    position: 'absolute',
    left: 10,
    top: 40,
    width: 50,
    height: 50,
  },
  profilIcon: {
    position: 'absolute',
    right: 10,
    top: 40,
    width: 50,
    height: 50,
  },

  inputContainer:{
    marginTop: 100
  },
  text:{
    color: colors.skrift,
    fontSize: 20,
    fontFamily: "Avenir",
    fontWeight: "700",
    position: "absolute",
    top: 240,
  },
  text2:{
    color: colors.skrift,
    fontSize: 20,
    fontFamily: "Avenir",
    fontWeight: "700",
    position: "absolute",
    top: 610,

  },
  input: {
    fontSize: 22, 
  },
  containerProdukt:{
    flex:1, 
    backgroundColor: "white", 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0,
    bottom: 0},

    image:{
      width: 180,
      height:180,
      position: "absolute",
      alignSelf: "center",
      top: 160
    },
    leggTil:{
      position: "absolute",
      alignSelf: "center",
      bottom: 40,

    },
    pageSlider:{
      position: "absolute",
      alignSelf: "center",
      bottom: 170,
    },
    page:{

      marginHorizontal: 10,
      height: 190,
      borderRadius: 10,
      backgroundColor: colors.light,
      borderColor: colors.medium,
      borderWidth: 2,
      
    },

    divider: {
      height: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Juster fargen etter ønske
      marginVertical: 10,
      width: "90%",
      left: 15,
      
      

    }

});

export default ScannerScreen;
