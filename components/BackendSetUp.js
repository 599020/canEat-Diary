import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function BackendSetUp() {


    const [id, setId] = useState('');
    const [value, setValue] = useState('');
    const [data, setData] = useState([]);

    const postData = async () => {
        const response = await fetch('http://192.168.10.229:8080/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, value })
        });
        const result = await response.text();
        console.log(result);
    };

    const fetchData = async () => {
        const response = await fetch('http://192.168.10.229:8080/data');
        const result = await response.json();
        setData(result);
    };
  return (
    <View style={styles.container}>
      <TextInput
          style={styles.input}
          placeholder="ID"
          value={id}
          onChangeText={setId}
      />
      <TextInput
          style={styles.input}
          placeholder="Value"
          value={value}
          onChangeText={setValue}
      />
      <Button
          title="Post"
          onPress={postData}
      />
      <Button
          title="Fetch Data"
          onPress={fetchData}
      />
      <View style={styles.listContainer}>
          <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                  <Text>{item.id}: {item.value}</Text>
              )}
          />
      </View>
  </View>
    
  )
}

const styles = StyleSheet.create({})