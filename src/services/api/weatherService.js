import { getApperClient } from "@/services/apperClient";

const weatherService = {
  async getForecast() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('weather_c', {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 7, "offset": 0}
      });

      if (!response.success) {
        console.error("Weather forecast fetch failed:", response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(item => ({
        Id: item.Id,
        date: item.date_c,
        condition: item.condition_c,
        temperature: typeof item.temperature_c === 'string' ? JSON.parse(item.temperature_c) : item.temperature_c,
        humidity: item.humidity_c,
        precipitation: item.precipitation_c
      }));
    } catch (error) {
      console.error("Weather forecast service error:", error);
      return [];
    }
  },

  async getCurrentWeather() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.fetchRecords('weather_c', {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      });

      if (!response.success) {
        console.error("Current weather fetch failed:", response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const item = response.data[0];
      return {
        Id: item.Id,
        date: item.date_c,
        condition: item.condition_c,
        temperature: typeof item.temperature_c === 'string' ? JSON.parse(item.temperature_c) : item.temperature_c,
        humidity: item.humidity_c,
        precipitation: item.precipitation_c
      };
    } catch (error) {
      console.error("Current weather service error:", error);
      return null;
    }
  }
};

export default weatherService;
