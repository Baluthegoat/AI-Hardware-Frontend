import React, { useEffect, useState } from "react";
import Thermometer from "react-thermometer-component";
import axios from "axios";

const Temperature = () => {
  const [temperatureData, setTemperatureData] = useState({
    temperature: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch the temperature data
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        setTemperatureData({
          temperature: response.data.temperature, // access the temperature data
        });
        setLastUpdated(new Date()); 
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        setError("Failed to fetch temperature data.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTemperatureData();

    // Setting interval to fetch temperature data every 5 seconds
    const interval = setInterval(() => {
      fetchTemperatureData();
    }, 5000); // every 5 seconds

    // Cleanup function that clears the interval when component is unmounted
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading temperature data...</div>;
  if (error) return <div>{error}</div>;

  // Determine the thermometer color and text color based on temperature
  const getThermometerColor = (temperature: number) => {
    console.log("Current Temperature:", temperature);  // Log temperature to see its value
    if (temperature < 5) return "#00f"; // Blue for below 5°C
    if (temperature >= 5 && temperature <= 15) return "#1ae54f"; // Green for 5°C to 15°C
    return "#f22c0d"; // Red for above 15°C
  };

  // Determine the text color based on the temperature range
  const getTextColor = (temperature: number) => {
    if (temperature < 5) return "text-blue-500"; // Blue for below 5°C
    if (temperature >= 5 && temperature <= 15) return "text-green-500"; // Green for 5°C to 15°C
    return "text-red-500"; // Red for above 15°C
  };

  const thermometerColor = getThermometerColor(temperatureData.temperature);
  const textColor = getTextColor(temperatureData.temperature);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center w-full flex-col items-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Temperature</h3>

          {/* Thermometer Component with dynamic color */}
          <Thermometer
            theme="light"
            value={temperatureData.temperature}
            max="30" // Set according to your expected temperature range
            steps="1"
            format="°C"
            size="large"
            height="200"
            thermometerColor={thermometerColor} // Apply dynamic color to the thermometer
          />

          {/* Temperature Data Below Thermometer */}
          <div className="mt-4 flex flex-col items-center">
            <p className={`text-lg font-semibold ${textColor}`}>
              {temperatureData.temperature}°C
            </p>

            {/* Temperature Range Label */}
            <div className="mt-2 text-lg font-semibold" style={{ color: thermometerColor }}>
              {temperatureData.temperature < 5
                ? "Cold"
                : temperatureData.temperature <= 15
                ? "Normal"
                : "Hot"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temperature;
