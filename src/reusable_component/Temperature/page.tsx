import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
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
        setLastUpdated(new Date()); // Update the last updated timestamp
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

  // Normalize temperature to range 0-1 for the gauge chart (-50 to 50 scale)
  const normalizedTemperature = (temperatureData.temperature + 50) / 100;

  // Determine the temperature range and color based on thresholds
  const getTemperatureRange = (temperature: number) => {
    if (temperature < 10) return { label: "Cold", color: "#00f" };
    if (temperature >= 10 && temperature < 25) return { label: "Normal", color: "#1ae54f" };
    return { label: "Hot", color: "#f22c0d" };
  };

  const { label, color } = getTemperatureRange(temperatureData.temperature);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Temperature</h3>

          {/* Gauge Chart */}
          <GaugeChart
            id="temperature-gauge"
            nrOfLevels={30}
            percent={normalizedTemperature} // Using normalized value for the gauge
            colors={["#00f", "#1ae54f", "#f22c0d"]} // Color range for cold, normal, hot
            arcWidth={0.3}
            animate={false}  // Disabling continuous animation of the gauge
            textColor="transparent" // Hides the percentage text inside the gauge
          />
          
          <p className={temperatureData.temperature < 0 ? "text-red-500" : "text-black"}>
            {temperatureData.temperature}°C
          </p>

          {/* Temperature Range Label */}
          <div className="mt-2 text-lg font-semibold" style={{ color }}>
            {label} {/* Display the temperature range (Cold/Normal/Hot) */}
          </div>

          {/* Live Update Message */}
          {lastUpdated && (
            <div className="text-sm text-gray-500 mt-2">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          
          {/* Displaying a message when data is being updated */}
          <div className="mt-2 text-sm text-blue-500">
            <span>Data is updating...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temperature;
