import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import axios from "axios";

const Temperature = () => {
  const [temperatureData, setTemperatureData] = useState({
    temperature: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the temperature data
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        setTemperatureData({
          temperature: response.data.temperature, // access the temperature data
        });
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        setError("Failed to fetch temperature data.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTemperatureData();

    // Set interval to fetch temperature data every 5 seconds
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Temperature</h3>
          <GaugeChart 
            id="temperature-gauge"
            nrOfLevels={30}
            percent={normalizedTemperature} // Using normalized value for the gauge
            colors={["#0DD3F2", "#f22c0d"]}
            arcWidth={0.3}
            animate={false}  // Disabling continuous animation of the gauge
            textColor="transparent" // Hides the percentage text inside the gauge
          />
          <p className={temperatureData.temperature < 0 ? "text-red-500" : "text-black"}>
            {temperatureData.temperature}°C
          </p>
        </div>
      </div>
    </div>
  );
};

export default Temperature;
