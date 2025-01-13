import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface BatteryProps {
  battery: { percentage: number };
}

const Battery: React.FC<BatteryProps> = ({ battery }) => {
  const { percentage } = battery;

  // Define color based on the battery percentage
  const getColor = () => {
    if (percentage > 60) return "#4caf50"; // Green
    if (percentage > 30) return "#ffeb3b"; // Yellow
    if (percentage > 15) return "#f44336"; // Red
    return "#b71c1c"; // Dark red for critically low or dead
  };

  // Define health status based on the battery percentage
  const getHealthStatus = () => {
    if (percentage === 0) return "Dead";
    if (percentage < 15) return "Critically Low";
    if (percentage <= 30) return "Bad";
    if (percentage <= 60) return "Good";
    return "Healthy";
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-800">
      <div style={{ width: "100px", height: "100px" }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: getColor(),
            trailColor: "#d6d6d6",
          })}
        />
      </div>
      <p className="mt-2 text-sm font-semibold">Health: {getHealthStatus()}</p>
    </div>
  );
};

export default Battery;
