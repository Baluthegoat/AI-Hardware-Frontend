import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart"; // Import the gauge chart library
import axios from "axios";

const Speedometer = () => {
  const [speedData, setSpeedData] = useState({
    speed: 0, // Default speed value
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the speed data
    const fetchSpeedData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");

        // Access speed from the API response
        setSpeedData({
          speed: response.data.speed || 0, // Ensure the speed field exists in the response
        });
      } catch (error) {
        console.error("Error fetching speed data:", error);
        setError("Failed to fetch speed data.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSpeedData();

    // Seting interval to fetch speed data every 1 second
    const interval = setInterval(() => {
      fetchSpeedData();
    }, 1000); // 1000 ms (1 second)

    // Cleanup function that clears the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading speed data...</div>;
  if (error) return <div>{error}</div>;

  // Normalize speed to range 0-1 for the gauge chart ( 0 to 200 km/h scale)
  const normalizedSpeed = speedData.speed / 200;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Speed</h2>
      <div className="flex justify-center w-full">
        <div className="text-center">
          <GaugeChart 
            id="speed-gauge"
            nrOfLevels={30}
            percent={normalizedSpeed} // Useing normalized value for the gauge
            colors={["#0DD3F2", "#f22c0d"]}
            arcWidth={0.3}
            animate={false}  // Disabling continuous animation of the gauge
          />
          <p className="text-lg mt-4">{speedData.speed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
