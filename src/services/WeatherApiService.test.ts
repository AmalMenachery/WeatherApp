import { getWeatherFromWeatherAPI, fetchGeoLocFromWeatherAPI } from '../services/WeatherApiService';
import axios from 'axios';

jest.mock('axios');

describe('WeatherApiService', () => {
  it('fetches weather data correctly from WeatherAPI', async () => {
    const mockWeatherResponse = { data: { current: { temp_c: 25, condition: { text: 'Sunny' } } } };
    (axios.get as jest.Mock).mockResolvedValue(mockWeatherResponse);

    const weather = await getWeatherFromWeatherAPI(40.7128, -74.0060);

    expect(weather.temperature).toBe('25');
    expect(weather.condition).toBe('Sunny');
  });

  it('fetches location data correctly from WeatherAPI', async () => {
    const mockLocationResponse = [{ name: 'New York', lat: 40.7128, lon: -74.0060 }];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLocationResponse });

    const locations = await fetchGeoLocFromWeatherAPI('New York');

    expect(locations[0].name).toBe('New York');
    expect(locations[0].lat).toBe(40.7128);
  });
});
