import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from 'expo-camera/next';

const ScannerScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const maaltidId = route.params ? route.params.maaltidId : null;

// får permission av tlf til kamera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);


  // denne blir kalt når camera har scanna strekkkoden, sender inn dataen.
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetchProductData(data);
      setProductData(response);
      await postDataToServer(response);
      navigation.navigate('FrokostScreen', {maaltidId}); // Navigerer til FrokostScreen
    } catch (error) {
      console.error('Error handling scanned product:', error);
      setErrorMessage('Feil ved behandling av skannet produkt. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  //sender inn strekkkoden til api og får varen i json sendt i retur
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

  //denne poster varen til backend
  const postDataToServer = async (productData) => {
    try {
      productData.maaltidId = maaltidId.id;
      const response = await fetch('http://192.168.68.102:8080/data', {
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



  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean8', 'ean13'],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <>
              {productData && (
                <View>
                  <Text>{productData.productName}</Text>
                  {/* Display other product information here */}
                  <Text>{maaltidId.id}</Text>
                </View>
              )}
              {scanned && !loading && (
                <Button title="Trykk for å skanne på nytt" onPress={() => setScanned(false)} />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ScannerScreen;
