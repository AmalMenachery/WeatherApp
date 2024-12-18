import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import App from "../App";
import * as WeatherAPI from "../services/WeatherApiService";
import * as OpenWeather from "../services/OpenWeatherService";

jest.mock("../services/WeatherApiService");
jest.mock("../services/OpenWeatherService");

const mockWeatherAPI = WeatherAPI.getWeatherFromWeatherAPI as jest.Mock;
const mockOpenWeather = OpenWeather.getWeatherFromOpenWeather as jest.Mock;

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches weather from WeatherAPI and displays it", async () => {
    mockWeatherAPI.mockResolvedValue({ temperature: "20", condition: "Cloudy" });
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    const input = getByPlaceholderText("Search for a location");
    const searchButton = getByText("Search");
    const toggleButton = getByText("Switch to OpenWeather");

    // Simulate entering a location and fetching weather from WeatherAPI
    fireEvent.changeText(input, "London");
    await act(async () => fireEvent.press(searchButton));

    expect(mockWeatherAPI).toHaveBeenCalledWith(51.51, -0.13);
    expect(getByText("20°C")).toBeTruthy();
    expect(getByText("Cloudy")).toBeTruthy();
    expect(queryByText("OpenWeather")).toBeFalsy();

    // Switch to OpenWeather and verify no WeatherAPI data
    fireEvent.press(toggleButton);
    expect(queryByText("20°C")).toBeFalsy();
  });

  it("fetches weather from OpenWeather and displays it", async () => {
    mockOpenWeather.mockResolvedValue({ temperature: "18", condition: "Rainy" });
    const { getByPlaceholderText, getByText } = render(<App />);

    const toggleButton = getByText("Switch to OpenWeather");
    const input = getByPlaceholderText("Search for a location");
    const searchButton = getByText("Search");

    // Switch to OpenWeather
    fireEvent.press(toggleButton);

    // Simulate entering a location and fetching weather from OpenWeather
    fireEvent.changeText(input, "Paris");
    await act(async () => fireEvent.press(searchButton));

    expect(mockOpenWeather).toHaveBeenCalledWith(48.8566, 2.3522);
    expect(getByText("18°C")).toBeTruthy();
    expect(getByText("Rainy")).toBeTruthy();
  });
});
