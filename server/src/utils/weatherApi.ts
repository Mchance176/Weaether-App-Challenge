import axios from 'axios';
import { WeatherResponse } from '../types/weather.js';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
const API_KEY = process.env.API_KEY;

// Add validation for API key
if (!API_KEY) {
    throw new Error('OpenWeather API key is not configured');
}

export async function getCoordinates(city: string) {
    try {
        console.log(`Getting coordinates for city: ${city}`);
        console.log(`Using API URL: ${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=***`);
        
        const response = await axios.get(
            `${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        
        console.log('Geocoding API response:', response.data);
        
        if (!response.data?.[0]) {
            throw new Error('City not found');
        }
        
        return {
            lat: response.data[0].lat,
            lon: response.data[0].lon,
            name: response.data[0].name
        };
    } catch (error) {
        console.error('Error in getCoordinates:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to get coordinates: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherResponse> {
    try {
        console.log(`Getting weather data for coordinates: lat=${lat}, lon=${lon}`);
        console.log(`Using API URL: ${API_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=***`);
        
        const response = await axios.get(
            `${API_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        console.log('Weather API response status:', response.status);
        
        return response.data;
    } catch (error) {
        console.error('Error in getWeatherData:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to get weather data: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
}