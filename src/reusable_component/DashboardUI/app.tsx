import React, { useState, useEffect } from "react";
import Speedometer from "../Speedometer/page";
import Camera from "../Camera/page";
import axios from "axios";

const Dashboard: React.FC = () => {
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
    const [data, setData] = useState({
        speed: "",
        gps: { latitude: 0, longitude: 0 },
        battery: { percentage: 0, health: "" },
        temperature: "17°C",
        location: "Bronx, NY",
        camera: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/data");

                const newData = {
                    speed: response.data.speed || "Unknown",
                    gps: response.data.gps || { latitude: 0, longitude: 0 },
                    battery: response.data.battery || { percentage: 0, health: "Good" },
                    temperature: response.data.temperature || "17°C",
                    location: response.data.location || "Bronx, NY",
                    camera: response.data.camera || "",
                };

                setData(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(newData)) {
                        return newData;
                    }
                    return prev;
                });

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data from the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const dataInterval = setInterval(fetchData, 2000);

        const clockInterval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(clockInterval);
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
        <div className="bg-black min-h-screen flex flex-col items-center justify-start p-4">
            {/* Top Speedometer Display */}
            <div className="mb-4">
                <Speedometer />
            </div>

            {/* Main Section */}
            <div className="flex w-full max-w-7xl items-center justify-between">
                {/* Left Map Panel */}
                <div className="bg-gray-900 rounded-lg p-4 w-1/2 h-64 flex flex-col items-center justify-center text-white border border-cyan-400">
                    <div className="text-sm mb-2">
                        Remain: 32.15 mi | ↰ 2.3 mi Left
                    </div>
                    <div className="bg-black w-full h-full rounded-lg flex items-center justify-center">
                        <span className="text-cyan-400">Map View</span>
                    </div>
                </div>

                {/* Center Camera Feed */}
                <div className="bg-black rounded-full border-4 border-cyan-400 w-80 h-80 flex items-center justify-center overflow-hidden">
                    <Camera camera={data.camera} />
                </div>

                {/* Right Battery + Weather */}
                <div className="flex flex-col gap-4 w-1/4">
                    {/* Battery Card */}
                    <div className="bg-gray-900 rounded-lg p-4 text-white border border-cyan-400">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-semibold">Battery</span>
                            <span className="text-2xl font-bold">
                                {data.battery.percentage}%
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Health: {data.battery.health}
                        </div>
                        <div className="text-sm text-gray-400">
                            Remaining: 34 hr 2 min
                        </div>
                    </div>

                    {/* Weather Card */}
                    <div className="bg-gray-900 rounded-lg p-4 text-white border border-cyan-400">
                        <div className="mb-1">{data.location}</div>
                        <div className="flex items-center">
                            <span className="text-2xl font-bold mr-2">
                                {data.temperature}
                            </span>
                            <span className="text-yellow-300">🌤️</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Outdoor Temperature
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Clock */}
            <div className="mt-4 text-sm text-gray-400">
                Current Time: {time}
            </div>
        </div>
    );
};

export default Dashboard;
