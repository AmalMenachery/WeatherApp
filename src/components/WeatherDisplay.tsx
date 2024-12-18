import React from "react";
import { View, Text, StyleSheet } from "react-native";

type WeatherDisplayProps = {
  temperature: string;
  condition: string;
  serviceName: string;
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = React.memo(
  ({ temperature, condition, serviceName }) => {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.serviceName,
            serviceName === "OpenWeather"
              ? styles.openWeatherStyling
              : styles.weatherApiTextStyling,
          ]}
        >
          {serviceName}
        </Text>
        <Text style={styles.temperature}>{temperature}°C</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    margin: 20,
    borderWidth:1,
    borderRadius: 16,
    height: 150,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  openWeatherStyling: {
    color: "#eb6e4b",
  },
  weatherApiTextStyling: {
    color: "#28a745",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
  },
  condition: {
    fontSize: 24,
  },
});

export default WeatherDisplay;
