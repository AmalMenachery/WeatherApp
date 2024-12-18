import React, { useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import WeatherDisplay from "./components/WeatherDisplay";
import LocationSearch from "./components/LocationSearch";
import useWeather from "./hooks/useWeather";

const App: React.FC = () => {
  const [useWeatherAPI, setWeatherAPI] = useState<boolean>(true);
  const { weather, fetchWeather } = useWeather(useWeatherAPI);

  const toggleWeatherService = () => {
    setWeatherAPI((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {weather && <WeatherDisplay {...weather} />}
      <LocationSearch onLocationSelect={fetchWeather} />
      <Button
        title={`Switch to ${
          useWeatherAPI ? "OpenWeather" : "Weather API"
        }`}
        onPress={toggleWeatherService}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export default App;
