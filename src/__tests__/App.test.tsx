import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import App from "../App";
import {
  getWeatherFromWeatherAPI,
  fetchGeoLocFromWeatherAPI,
} from "../services/WeatherApiService";
import { getWeatherFromOpenWeather } from "../services/OpenWeatherService";

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
    const { getByPlaceholderText, getByText, queryByText, findByText } = render(
      <App />
    );

    const input = getByPlaceholderText("Search for a location");
    const toggleButton = getByText("Switch to OpenWeather");

    // Simulate entering a location and fetching weather from WeatherAPI
    fireEvent.changeText(input, "London");

    expect(fetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    // Wait for suggestions to render
    expect(await findByText("London")).toBeTruthy();
    expect(await findByText("Londonderry")).toBeTruthy();

    // Select a location
    fireEvent.press(getByText("London"));

    await waitFor(() => {
      expect(queryByText("Londonderry")).toBeNull();
    });

    expect(getWeatherFromWeatherAPI).toHaveBeenCalledWith(51.51, -0.13);

    await waitFor(() => {
      expect(getByText("20°C")).toBeTruthy();
      expect(getByText("Cloudy")).toBeTruthy();
      expect(queryByText("OpenWeather")).toBeFalsy();
    });

    // Switch to OpenWeather and verify no WeatherAPI data
    fireEvent.press(toggleButton);
    await waitFor(() => {
      expect(getByText("Switch to Weather API")).toBeTruthy();
      expect(queryByText("20°C")).toBeFalsy();
    });
  });

  it("fetches weather from OpenWeather and displays it", async () => {
    const { getByPlaceholderText, getByText, queryByText, findByText } = render(
      <App />
    );

    const toggleButton = getByText("Switch to OpenWeather");
    const input = getByPlaceholderText("Search for a location");

    // Switch to OpenWeather
    fireEvent.press(toggleButton);
    waitFor(() => {
      expect(getByText("Switch to Weather API")).toBeTruthy();
    });
    // Simulate entering a location and fetching weather from OpenWeather
    fireEvent.changeText(input, "London");

    // TODO: Switch to OpenWeather GeoFetch
    expect(fetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    // Wait for suggestions to render
    expect(await findByText("London")).toBeTruthy();
    expect(await findByText("Londonderry")).toBeTruthy();

    // Select a location
    fireEvent.press(getByText("London"));

    await waitFor(() => {
      expect(queryByText("Londonderry")).toBeNull();
    });

    expect(getWeatherFromOpenWeather).toHaveBeenCalledWith(51.51, -0.13);
    await waitFor(() => {
      expect(getByText("18°C")).toBeTruthy();
      expect(getByText("Rainy")).toBeTruthy();
    });
  });
});
