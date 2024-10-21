"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function WeatherCards() {
  // List of metro cities
  const metrocities = ['Delhi', 'Mumbai', 'Hyderabad', 'Kolkata', 'Chennai', 'Bangalore'];
  const [weatherData, setWeatherData] = useState([]);
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

  // Fetch weather data every 5 minutes (300000 milliseconds)
  useEffect(() => {
    fetchWeatherData(); // Initial fetch

    const interval = setInterval(() => {
      console.log("Fetching weather data..."); // Log fetching interval
      fetchWeatherData();
    }, 300000); // 5 minutes

    // return () => {
    //   clearInterval(interval); // Cleanup on component unmount
    //   console.log("Cleared interval."); // Log cleanup
    // };
  }, []);

  // Example useEffect in your React component
useEffect(() => {
  const fetchWeatherSummaries = async () => {
      try {
          const response = await axios.get('http://localhost:5000/api/weather-summaries');
          console.log(response.data); // Handle the summary data as needed
      } catch (error) {
          console.error('Error fetching weather summaries:', error);
      }
  };

  fetchWeatherSummaries();
}, []);


  return (
    <div className="bg-blue-300 min-h-screen">
      <h1 className="text-3xl font-bold pt-5 text-center">Weather Forecast</h1>
<div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {weatherData.map((weatherItem, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
          <h2 className="text-lg font-bold mb-2">{metrocities[index]}</h2>
          <h6 className="text-3xl font-semibold mb-2">{(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
          <h5 className="text-gray-600 mb-1"><i className="fa-solid fa-wind"></i>&nbsp;{weatherItem.wind.speed} M/S</h5>
          <h5 className="text-gray-600 mb-1"><i className="fa-solid fa-droplet"></i>&nbsp;{weatherItem.main.humidity}%</h5>
          <h6 className="text-md mb-2"><i class="fa-solid fa-hand-holding-water"></i>&nbsp;{(weatherItem.main.feels_like - 273.15).toFixed(2)}°C</h6>
          <h6 className="text-md mb-2"><i class="fa-solid fa-temperature-high"></i>&nbsp; {(weatherItem.main.temp_max - 273.15).toFixed(2)}°C</h6>
          <h6 className="text-md mb-2"><i class="fa-solid fa-temperature-low"></i>&nbsp; {(weatherItem.main.temp_min - 273.15).toFixed(2)}°C</h6>
          <div className="icon mb-2">
            <img src={`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png`} alt="weather-icon" className="w-20 h-20"/>
            <h6 className="text-sm text-gray-500 text-center">{weatherItem.weather[0].description}</h6>
          </div>
        </div>
      ))}
    </div>
    </div>
    
  );
}
 