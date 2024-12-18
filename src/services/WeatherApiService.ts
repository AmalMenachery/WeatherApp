import axios from 'axios';


const apiKey = 'a4e48f29417442d39af164452241612'; // move this to .env

export const getWeatherFromWeatherAPI = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
      params: { key: apiKey, q: `${lat},${lon}` },
    });

    const { temp_c } = response.data.current;
    const { text } = response.data.current.condition;

    return {
      temperature: temp_c.toString(),
      condition: text,
    };
  } catch (error) {
    console.error('Error fetching weather from WeatherAPI:', error);
    throw error;
  }
};

export const fetchGeoLocFromWeatherAPI = async (text: string) => {
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
      params: { key: apiKey, q: text },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
  }
};
