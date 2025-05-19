import React, { useEffect, useState } from "react";
import axios from "axios";

const Speedometer = () => {
  const [speedData, setSpeedData] = useState({
    speed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeedData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        setSpeedData({
          speed: response.data.speed || 0,
        });
      } catch (error) {
        console.error("Error fetching speed data:", error);
        setError("Failed to fetch speed data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpeedData();
    const interval = setInterval(fetchSpeedData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white">Loading speed data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-center space-x-4">
        <h2 className="text-white tracking-wider text-xl mt-2">SPEED</h2>
        <div className="text-8xl font-extrabold text-blue-400 leading-none">
          {speedData.speed}
        </div>
        <span className="text-white text-2xl mt-2">MPH</span>
      </div>
    </div>
  );
};

export default Speedometer;
