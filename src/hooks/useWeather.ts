import { useState, useCallback, useRef, useEffect } from "react";
import { getWeatherFromOpenWeather } from "../services/OpenWeatherService";
import { getWeatherFromWeatherAPI } from "../services/WeatherApiService";

type WEATHER_T = {
  temperature: string;
  condition: string;
  serviceName: string;
} | null;

type LOCATION_T = {
  lat: number;
  lon: number;
  name: string;
};

const useWeather = (useWeatherAPI: boolean) => {
  const [weather, setWeather] = useState<WEATHER_T>(null);
  const location = useRef<LOCATION_T | null>(null);

  const fetchWeather = useCallback(
    async (newLocation: LOCATION_T) => {
      try {
        location.current = newLocation;
        const weatherData = useWeatherAPI
          ? await getWeatherFromWeatherAPI(newLocation.lat, newLocation.lon)
          : await getWeatherFromOpenWeather(newLocation.lat, newLocation.lon);
        setWeather({
          ...weatherData,
          serviceName: useWeatherAPI ? "Weather API" : "OpenWeather",
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    },
    [useWeatherAPI]
  );

  useEffect(() => {
    if (location.current) {
      fetchWeather(location.current);
    }
  }, [useWeatherAPI]);

  return { weather, fetchWeather };
};

export default useWeather;
