import React, { useState, useEffect } from "react";
import axios from "axios";

const Temperature = () => {
  const [temperatureData, setTemperatureData] = useState({
    internal: "",
    external: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from your backend server, which will then fetch from the dummy server
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        // Assume the response contains { temperature: { internal, external }, gps, speed }
        setTemperatureData({
          internal: response.data.temperature, // Assuming temperature data is inside response.data
          external: response.data.temperature, // Or change it if your API provides separate internal and external data
        });
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        setError("Failed to fetch temperature data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemperatureData();
  }, []);

  if (loading) return <div>Loading temperature data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Temperature</h2>
      <p>Internal: {temperatureData.internal}°C</p>
      <p>External: {temperatureData.external}°C</p>
    </div>
  );
};

export default Temperature;