import React from "react";
import { render } from "@testing-library/react-native";
import WeatherDisplay from "./WeatherDisplay";

describe("WeatherDisplay", () => {
  it("renders correctly with props", () => {
    const { getByText } = render(
      <WeatherDisplay temperature="25" condition="Sunny" serviceName="WeatherAPI" />
    );

    expect(getByText("WeatherAPI")).toBeTruthy();
    expect(getByText("25°C")).toBeTruthy();
    expect(getByText("Sunny")).toBeTruthy();
  });
});
