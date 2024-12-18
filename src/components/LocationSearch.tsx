import React, { useCallback, useState } from "react";
import {
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { throttle } from "lodash";
import { fetchGeoLocFromWeatherAPI } from "../services/WeatherApiService";

type Location = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

type LocationSearchProps = {
  onLocationSelect: (location: {
    lat: number;
    lon: number;
    name: string;
  }) => void;
};

const LocationsList: React.FC<{
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}> = ({ locations, onLocationSelect }) => {
  return (
    <FlatList
      data={locations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.suggestion}
          onPress={() => onLocationSelect(item)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);

  const fetchSuggestions = async (text: string) => {
    try {
      const locationData = await fetchGeoLocFromWeatherAPI(text);
      setSuggestions(locationData);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Throttled function to fetch suggestions
  const throttledFetchSuggestions = useCallback(
    throttle((text: string) => fetchSuggestions(text), 1000),
    []
  );

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (text.length > 3) {
      throttledFetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setQuery(location.name);
    setSuggestions([]);
    onLocationSelect({
      lat: location.lat,
      lon: location.lon,
      name: location.name,
    });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for a location"
        value={query}
        onChangeText={handleInputChange}
      />
      <LocationsList
        locations={suggestions}
        onLocationSelect={handleLocationSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default LocationSearch;
