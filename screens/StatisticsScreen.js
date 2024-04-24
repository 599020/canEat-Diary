import React, { useState } from 'react';
import { Text, StyleSheet, SafeAreaView, Dimensions, Button, TouchableOpacity, ScrollView, View } from 'react-native';
import colors from '../config/colors';
import { LineChart } from 'react-native-chart-kit';
import { API_BASE_URL } from '../config/ipAdress';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function StatisticsScreen({ route }) {
  const [chartData, setChartData] = useState({
    protein: null,
    carbohydrates: null,
    fat: null,
    calories: null
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datoFra, setDatoFra] = useState(null);
  const [datoTil, setDatoTil] = useState(null);

  const handleConfirmDate = (date) => {
    if (!datoFra || selectedDate === 'startDate') {
      setDatoFra(date);
      setSelectedDate(null);
    } else {
      setDatoTil(date);
      setSelectedDate(null);
    }
  };
  

  const fetchDataForNutrient = async (nutrient) => {
    try {
      const response = await fetch(`${API_BASE_URL}/readDager/${datoFra}/${datoTil}`);
      const data = await response.json();

      const nutrientData = {
        labels: [],
        datasets: [{
          data: [],
        }],
      };

      const nutrientKey = nutrient === "calories" ? "energyPr100kcal" : `${nutrient}Pr100`;
      
      const dailyNutrientSum = {};

      data.forEach(måltid => {
        if (!dailyNutrientSum[måltid.idDato]) {
          dailyNutrientSum[måltid.idDato] = 0;
        }

        let nutrientSum = 0;
        måltid.produkter.forEach(produkt => {
          nutrientSum += produkt.nutriments[nutrientKey] || 0;
        });

        dailyNutrientSum[måltid.idDato] += nutrientSum;
      });

      Object.keys(dailyNutrientSum).forEach(idDato => {
        nutrientData.labels.push(idDato);
        nutrientData.datasets[0].data.push(Math.round(dailyNutrientSum[idDato])); // Rund til nærmeste heltall
      });
      

      return nutrientData;
    } catch (error) {
      console.error('Feil ved henting av data:', error);
    }
  };

  const handleFetchData = async () => {
    const proteinData = await fetchDataForNutrient("protein");
    const carbohydratesData = await fetchDataForNutrient("carbohydrates");
    const fatData = await fetchDataForNutrient("fat");
    const caloriesData = await fetchDataForNutrient("calories");

    setChartData({
      protein: proteinData,
      carbohydrates: carbohydratesData,
      fat: fatData,
      calories: caloriesData
    });
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Din Oppsummering</Text>
      <TouchableOpacity onPress={() => {
        setSelectedDate('startDate');
        toggleDatePicker();
}}>
  <Text style={styles.datePickerText}>{datoFra ? datoFra.toDateString() : "Start Date"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        setSelectedDate('endDate');
        toggleDatePicker();
      }}>
  <Text style={styles.datePickerText}>{datoTil ? datoTil.toDateString() : "End Date"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={toggleDatePicker}
      />
      <Button title="Hent Data" onPress={handleFetchData} />
      <ScrollView style={{ marginTop: 20 }}>
        {Object.keys(chartData).map((nutrient, index) => (
          chartData[nutrient] && (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={styles.chartHeader}>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</Text>
              <LineChart
  data={chartData[nutrient]}
  width={Dimensions.get('window').width - 40}
  height={220}
  // Fjerner yAxisLabel
  chartConfig={{
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => colors.skrift,
    labelColor: (opacity = 1) => colors.skrift,
    strokeWidth: 3,
    style: {
      fontSize: 2
    },
  }}
  verticalLabelRotation={10}
  fromZero={true}
/>

            </View>
          )
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.skrift,
    alignSelf: 'center',
    padding: 40,
  },
  datePickerText: {
    fontSize: 18,
    color: colors.skrift,
    alignSelf: 'center',
    padding: 10,
  },
  chartHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.skrift,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
