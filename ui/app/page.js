
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function WeatherCards() {
  const metrocities = ['Delhi', 'Mumbai', 'Hyderabad', 'Kolkata', 'Chennai', 'Bangalore'];
  const [weatherData, setWeatherData] = useState([]);
  const [thresholds, setThresholds] = useState({}); // State to hold thresholds

  const API_KEY = "0bbfb4a1bc1f482b78f8c11e2f18fb76"; // Replace with your OpenWeatherMap API key

  // Function to fetch weather details for a single city
  const getWeatherDetails = async (cityName) => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${cityName}: `, error);
      return null; // Return null for error handling
    }
  };

  // Function to fetch weather data for all cities
  const fetchWeatherData = async () => {
    const allWeatherData = await Promise.all(metrocities.map(city => getWeatherDetails(city)));
    setWeatherData(allWeatherData.filter(data => data)); // Filter out any failed requests
  };

  // Check thresholds and alert
  const checkThresholds = () => {
    weatherData.forEach((weatherItem, index) => {
      const cityName = metrocities[index];
      const tempInCelsius = (weatherItem.main.temp - 273.15).toFixed(2);
      const userThreshold = thresholds[cityName];

      if (userThreshold && tempInCelsius > userThreshold) {
        alert(`Alert! The temperature in ${cityName} has exceeded ${userThreshold}°C. Current temperature: ${tempInCelsius}°C`);
        console.log(`Alert for ${cityName}: ${tempInCelsius}°C exceeds threshold of ${userThreshold}°C`);
      }
    });
  };

  useEffect(() => {
    fetchWeatherData(); // Initial fetch
    const interval = setInterval(() => {
      console.log("Fetching weather data...");
      fetchWeatherData();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(interval);
      console.log("Cleared interval.");
    };
  }, []);

  useEffect(() => {
    checkThresholds(); // Check thresholds after fetching weather data
  }, [weatherData]); // Runs whenever weatherData changes

  // Function to handle threshold input changes
  const handleThresholdChange = (cityName, value) => {
    setThresholds(prev => ({ ...prev, [cityName]: value }));
  };

  return (
    <div className="bg-blue-300 min-h-screen">
      <h1 className="text-3xl font-bold pt-5 text-center">Weather Forecast</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {metrocities.map((city, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
            <h2 className="text-lg font-bold mb-2">{city}</h2>
            <h6 className="text-3xl font-semibold mb-2">{(weatherData[index]?.main.temp - 273.15).toFixed(2)}°C</h6>
            <h5 className="text-gray-600 mb-1"><i className="fa-solid fa-wind"></i>&nbsp;{weatherData[index]?.wind.speed} M/S</h5>
            <h5 className="text-gray-600 mb-1"><i className="fa-solid fa-droplet"></i>&nbsp;{weatherData[index]?.main.humidity}%</h5>
            <h6 className="text-md mb-2"><i className="fa-solid fa-hand-holding-water"></i>&nbsp;{(weatherData[index]?.main.feels_like - 273.15).toFixed(2)}°C</h6>
            <h6 className="text-md mb-2"><i className="fa-solid fa-temperature-high"></i>&nbsp; {(weatherData[index]?.main.temp_max - 273.15).toFixed(2)}°C</h6>
            <h6 className="text-md mb-2"><i className="fa-solid fa-temperature-low"></i>&nbsp; {(weatherData[index]?.main.temp_min - 273.15).toFixed(2)}°C</h6>
            <div className="icon mb-2">
              <img src={`https://openweathermap.org/img/wn/${weatherData[index]?.weather[0].icon}@4x.png`} alt="weather-icon" className="w-20 h-20"/>
              <h6 className="text-sm text-gray-500 text-center">{weatherData[index]?.weather[0].description}</h6>
            </div>
            <input
              type="number"
              placeholder="Set Threshold"
              className="border rounded p-2 mb-2"
              onChange={(e) => handleThresholdChange(city, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
