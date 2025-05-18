import React, { useEffect, useState } from "react";
import axios from "axios";

const Speedometer = () => {
  const [speedData, setSpeedData] = useState({
    speed: 0,
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

    // Set interval to fetch speed data every 1 second
    const interval = setInterval(() => {
      fetchSpeedData();
    }, 1000); // 1000 ms (1 second)

    // Cleanup function that clears the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white">Loading speed data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div>
  <div className="flex items-center justify-center space-x-2">
    <h2 className="text-gray-400 uppercase tracking-wider text-sm">SPEED</h2>
    <div className="text-5xl font-bold text-blue-400">{speedData.speed}</div>
    <span className="text-gray-400 text-lg">MPH</span>
  </div>
</div>




  
  );
};

export default Speedometer;