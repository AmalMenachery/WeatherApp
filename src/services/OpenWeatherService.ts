import axios from 'axios';

const apiKey = '4e06dae2de69387f09f0281a717f5ae8'; // move this to .env


export const getWeatherFromOpenWeather = async (lat: number, lon: number) => {
  try {
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`,
      { params: { lat, lon, appid: apiKey, units: 'metric' } }
    );

    const { temp } = weatherResponse.data.main;
    const { description } = weatherResponse.data.weather[0];

    return {
      temperature: temp.toString(),
      condition: description,
    };
  } catch (error) {
    console.error('Error fetching weather from OpenWeatherMap:',{error});
    throw error;
  }
};

export const fetchGeoLocFromOpenWeatherMap = async (text: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: { q: text, appid: apiKey, limit: 5 }, // Limit results to 5 locations
      }
    );

    if (response.data.length === 0) {
      throw new Error('No locations found');
    }

    return response.data.map((location: any) => ({
      name: location.name,
      region: location.state || '',
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      id: `${location.lat} ${location.lon}`,
    }));
  } catch (error) {
    console.error('Error fetching location suggestions from OpenWeatherMap:', error);
    return [];
  }
};


