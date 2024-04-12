import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/ipAddress';

export default function Notat() {
  const [notat, setNotat] = useState('');
  const [lagretNotat, setLagretNotat] = useState('');

  // Hent lagret notat når komponenten blir fokusert
  useFocusEffect(
    React.useCallback(() => {
      const hentLagretNotat = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/hentLagretNotat`);
          const data = await response.json();
          setLagretNotat(data.notat);
        } catch (error) {
          console.error('Feil ved henting av lagret notat:', error);
        }
      };

      hentLagretNotat();

      return () => {
        // Rens opp når komponenten fjernes fra skjermen
      };
    }, [])
  );

  // Lagre notatet når brukeren forlater tekstfeltet
  const lagreNotat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lagreNotat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notat: notat }),
      });
      if (response.ok) {
        console.log('Notatet er lagret.');
      } else {
        console.error('Feil ved lagring av notat:', response.status);
      }
    } catch (error) {
      console.error('Feil ved håndtering av lagring av notat:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Skriv ditt notat her..."
        value={notat}
        onChangeText={setNotat}
        onBlur={lagreNotat}
      />
      <Button title="Lagre" onPress={lagreNotat} />
      <View style={styles.lagretNotatContainer}>
        <TextInput
          style={styles.lagretNotat}
          multiline
          editable={false}
          value={lagretNotat}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  lagretNotatContainer: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  lagretNotat: {
    textAlignVertical: 'top',
  },
});
