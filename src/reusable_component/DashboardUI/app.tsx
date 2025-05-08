import React, { useState, useEffect } from "react";
import Speedometer from "../Speedometer/page";
import Camera from "../Camera/page";
import axios from "axios";

const Dashboard: React.FC = () => {
    const [time, setTime] = useState<string>("");
    const [data, setData] = useState({
        speed: "",
        gps: { latitude: 0, longitude: 0 },
        battery: { percentage: 0, health: "" },
        camera: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await axios.get("http://localhost:3001/api/data");
            setData({
                speed: response.data.speed || "Unknown",
                gps: response.data.gps || { latitude: 0, longitude: 0 },
                battery: response.data.battery || { percentage: 0, health: "Good" },
                camera: response.data.camera || "",
            });
            } catch (error) {
            setError("Failed to fetch data from the server.");
            } finally {
            setLoading(false);
            }
        };
    
        fetchData();
    
        const interval = setInterval(() => {
          fetchData(); // Refresh data every second
        }, 10);
    
        const timeInterval = setInterval(() => {
        setTime(new Date().toLocaleTimeString());
        }, 1000);
    
        return () => {
          clearInterval(interval); // Cleanup intervals
        clearInterval(timeInterval);
        };
    }, []);
    
    if (loading)
        return (
        <div className="flex justify-center items-center h-screen text-gray-800">
            Loading data...
        </div>
        );
    if (error)
        return (
        <div className="flex justify-center items-center h-screen text-red-500">
            {error}
            </div>
        );
        
    return (
<div className="bg-black min-h-screen flex flex-col items-center justify-start relative">
  {/* Speed bar container */}
  <div className="relative z-20 mt-8">
    <div className="relative bg-black p-2 rounded-lg z-20">
      <Speedometer />
    </div>
  </div>

  {/* Camera */}
  <div className="w-full max-w-lg relative z-10">
    <Camera camera={data.camera} />
  </div>
</div>

      
);
};

export default Dashboard;

