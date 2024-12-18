import { renderHook, act } from "@testing-library/react-hooks";
import useWeather from "../hooks/useWeather";
import * as WeatherAPI from "../services/WeatherApiService";
import * as OpenWeather from "../services/OpenWeatherService";

jest.mock("../services/WeatherApiService");
jest.mock("../services/OpenWeatherService");

const mockWeatherAPI = WeatherAPI.getWeatherFromWeatherAPI as jest.Mock;
const mockOpenWeather = OpenWeather.getWeatherFromOpenWeather as jest.Mock;

describe("useWeather", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches weather data from WeatherAPI", async () => {
    const location = { lat: 51.51, lon: -0.13, name: "London" };
    mockWeatherAPI.mockResolvedValue({
      temperature: "20",
      condition: "Cloudy",
    });

    const { result } = renderHook(() => useWeather(true));

    await act(async () => {
      await result.current.fetchWeather(location);
    });

    expect(mockWeatherAPI).toHaveBeenCalledWith(location.lat, location.lon);
    expect(result.current.weather).toEqual({
      temperature: "20",
      condition: "Cloudy",
      serviceName: "Weather API",
    });
  });

  it("fetches weather data from OpenWeather", async () => {
    const location = { lat: 48.8566, lon: 2.3522, name: "Paris" };
    mockOpenWeather.mockResolvedValue({
      temperature: "18",
      condition: "Rainy",
    });

    const { result } = renderHook(() => useWeather(false));

    await act(async () => {
      await result.current.fetchWeather(location);
    });

    expect(mockOpenWeather).toHaveBeenCalledWith(location.lat, location.lon);
    expect(result.current.weather).toEqual({
      temperature: "18",
      condition: "Rainy",
      serviceName: "OpenWeather",
    });
  });

});
