import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import App from "../App";
import {
  getWeatherFromWeatherAPI,
  fetchGeoLocFromWeatherAPI,
} from "../services/WeatherApiService";
import {
  getWeatherFromOpenWeather,
  fetchGeoLocFromOpenWeatherMap,
} from "../services/OpenWeatherService";

const LocationListMock = [
  {
    id: 1,
    name: "London",
    region: "England",
    country: "UK",
    lat: 51.51,
    lon: -0.13,
  },
  {
    id: 2,
    name: "Londonderry",
    region: "Northern Ireland",
    country: "UK",
    lat: 54.997,
    lon: -7.307,
  },
];

jest.mock("../services/WeatherApiService", () => ({
  getWeatherFromWeatherAPI: jest.fn().mockResolvedValue({
    temperature: "20",
    condition: "Cloudy",
  }),
  fetchGeoLocFromWeatherAPI: jest.fn().mockResolvedValue(LocationListMock),
}));
jest.mock("../services/OpenWeatherService", () => ({
  getWeatherFromOpenWeather: jest.fn().mockResolvedValue({
    temperature: "18",
    condition: "Rainy",
  }),
  fetchGeoLocFromOpenWeatherMap: jest.fn().mockResolvedValue(LocationListMock),
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches weather from WeatherAPI and displays it", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    const input = getByPlaceholderText("Search for a location");
    const toggleButton = getByText("Switch to OpenWeather");

    // Simulate entering a location and fetching weather from WeatherAPI
    fireEvent.changeText(input, "London");

    await expect(fetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    // Wait for suggestions to render
    expect(getByText("London")).toBeTruthy();
    expect(getByText("Londonderry")).toBeTruthy();

    // Select a location
    fireEvent.press(getByText("London"));

    expect(getWeatherFromWeatherAPI).toHaveBeenCalledWith(51.51, -0.13);
    waitFor(() => {
      expect(getByText("20°C")).toBeTruthy();
      expect(getByText("Cloudy")).toBeTruthy();
      expect(queryByText("OpenWeather")).toBeFalsy();
    });

    // Switch to OpenWeather and verify no WeatherAPI data
    fireEvent.press(toggleButton);
    expect(queryByText("20°C")).toBeFalsy();
  });

  it.only("fetches weather from OpenWeather and displays it", async () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    const toggleButton = getByText("Switch to OpenWeather");
    const input = getByPlaceholderText("Search for a location");

    // Switch to OpenWeather
    fireEvent.press(toggleButton);
    waitFor(() => {
      expect(getByText("Switch to WeatherAPI")).toBeTruthy();
    });
    // Simulate entering a location and fetching weather from OpenWeather
    fireEvent.changeText(input, "London");

    // TODO: Switch to OpenWeather GeoFetch
    await expect(fetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    // Wait for suggestions to render
    expect(getByText("London")).toBeTruthy();
    expect(getByText("Londonderry")).toBeTruthy();

    // Select a location
    fireEvent.press(getByText("London"));

    expect(getWeatherFromOpenWeather).toHaveBeenCalledWith(51.51, -0.13);
    waitFor(() => {
      expect(getByText("18°C")).toBeTruthy();
      expect(getByText("Rainy")).toBeTruthy();
    });
  });
});
