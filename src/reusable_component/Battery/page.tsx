import React from "react";

interface BatteryProps {
  battery: { percentage: number; health: string };
}

const Battery: React.FC<BatteryProps> = ({ battery }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3>Battery</h3>
      <p>{battery.percentage}%</p>
      <p>Status: {battery.health}</p>
    </div>
  );
};

export default Battery;