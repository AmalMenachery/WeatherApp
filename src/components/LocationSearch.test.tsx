import React, { act } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LocationSearch from "./LocationSearch";
import * as WeatherAPI from "../services/WeatherApiService";

jest.mock("../services/WeatherApiService");

const mockFetchGeoLocFromWeatherAPI =
  WeatherAPI.fetchGeoLocFromWeatherAPI as jest.Mock;

describe("LocationSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input and suggestions correctly", async () => {
    mockFetchGeoLocFromWeatherAPI.mockResolvedValue([
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
    ]);

    const mockOnLocationSelect = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LocationSearch onLocationSelect={mockOnLocationSelect} />
    );

    const input = getByPlaceholderText("Search for a location");

    fireEvent.changeText(input, "London");

    await expect(mockFetchGeoLocFromWeatherAPI).toHaveBeenCalledWith("London");

    // Wait for suggestions to render
    expect(await getByText("London")).toBeTruthy();
    expect(await getByText("Londonderry")).toBeTruthy();

    // Select a location
    fireEvent.press(getByText("London"));

    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      lat: 51.51,
      lon: -0.13,
      name: "London",
    });
  });
});
