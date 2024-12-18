import { getWeatherFromOpenWeather, fetchGeoLocFromOpenWeatherMap } from '../services/OpenWeatherService';
import axios from 'axios';

jest.mock('axios');

describe('OpenWeatherService', () => {
  it('fetches weather data correctly from OpenWeather', async () => {
    const mockWeatherResponse = { data: { main: { temp: 25 }, weather: [{ description: 'Sunny' }] } };
    (axios.get as jest.Mock).mockResolvedValue(mockWeatherResponse);

    const weather = await getWeatherFromOpenWeather(40.7128, -74.0060);

    expect(weather.temperature).toBe('25');
    expect(weather.condition).toBe('Sunny');
  });

  it('fetches location data correctly from OpenWeatherMap', async () => {
    const mockLocationResponse = [{ name: 'New York', lat: 40.7128, lon: -74.0060 }];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLocationResponse });

    const locations = await fetchGeoLocFromOpenWeatherMap('New York');
    
    expect(locations[0].name).toBe('New York');
    expect(locations[0].lat).toBe(40.7128);
  });
});
