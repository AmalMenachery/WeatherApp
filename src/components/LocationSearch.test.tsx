import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LocationSearch from "./LocationSearch";
import { fetchGeoLocFromWeatherAPI } from "../services/WeatherApiService";

jest.mock("../services/WeatherApiService", () => ({
  getWeatherFromWeatherAPI: jest.fn(),
  fetchGeoLocFromWeatherAPI: jest.fn().mockResolvedValue(LocationListMock),
}));

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

describe("LocationSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input and suggestions correctly", async () => {
    const mockOnLocationSelect = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LocationSearch onLocationSelect={mockOnLocationSelect} />
    );

    const input = getByPlaceholderText("Search for a location");

    await act(async () => {
      fireEvent.changeText(input, "London");
    });

    await expect(fetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    await waitFor(() => {
      // Check that suggestions are rendered
      expect(getByText("London")).toBeTruthy();
      expect(getByText("Londonderry")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText("London"));
    });

    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      lat: 51.51,
      lon: -0.13,
      name: "London",
    });
  });
});
