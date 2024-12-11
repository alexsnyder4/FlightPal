import React, { useState, useEffect } from "react";
import "../CSS/Card.css";

const FuelBurnCard = () => {
  const [initialFuel, setInitialFuel] = useState("");
  const [currentFuel, setCurrentFuel] = useState("");
  const [initialTime, setInitialTime] = useState(""); // Allows dynamic input for initial time
  const [lastTime, setLastTime] = useState(null); // Tracks the last "Calculate" time
  const [burnRates, setBurnRates] = useState([]); // Stores burn rate results
  const [isRunning, setIsRunning] = useState(false);

  const calculateFuel = () => {
    if (!initialTime || !lastTime || !currentFuel || !initialFuel) {
      alert("Please ensure all inputs are filled correctly.");
      return;
    }

    // Convert times to Date objects
    const startTime = new Date(`1970-01-01T${initialTime}:00Z`);
    const endTime = new Date();

    const elapsedHours = (endTime - lastTime) / 3600000; // Time in hours

    // Calculate burn rate
    const burnRate = (initialFuel - currentFuel) / elapsedHours;

    // Store the result
    const newBurnRate = {
      interval: `${lastTime.toTimeString().slice(0, 5)} - ${endTime.toTimeString().slice(0, 5)}`,
      initialFuel,
      currentFuel,
      burnRate: burnRate.toFixed(2),
    };

    setBurnRates([...burnRates, newBurnRate]);

    // Update the last time and initial fuel
    setLastTime(endTime);
    setInitialFuel(currentFuel); // The current fuel becomes the new "initial fuel"
  };

  const startTimer = () => {
    if (!initialTime) {
      alert("Please enter a valid initial time.");
      return;
    }

    setLastTime(new Date()); // Start tracking the last time
    setIsRunning(true);
  };

  return (
    <div className="card fuel-burn-card card-medium">
      <h2>Fuel Burn Calculator</h2>
      <div>
        <label>Initial Fuel (gallons): </label>
        <input
          type="number"
          value={initialFuel}
          onChange={(e) => setInitialFuel(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Current Fuel (gallons): </label>
        <input
          type="number"
          value={currentFuel}
          onChange={(e) => setCurrentFuel(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Initial Time (HH:MM): </label>
        <input
          type="time"
          value={initialTime}
          onChange={(e) => setInitialTime(e.target.value)}
        />
      </div>
      <div>
        <button className="button" onClick={startTimer} disabled={isRunning}>
          Start Timer
        </button>
      </div>
      <div>
        <button className="button"onClick={calculateFuel} disabled={!isRunning}>
          Calculate (Lap)
        </button>
      </div>
      <div>
        <h3>Lap Results:</h3>
        {burnRates.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>Initial Fuel (gallons)</th>
                <th>Current Fuel (gallons)</th>
                <th>Fuel Burn Rate (gallons/hour)</th>
              </tr>
            </thead>
            <tbody>
              {burnRates.map((rate, index) => (
                <tr key={index}>
                  <td>{rate.interval}</td>
                  <td>{rate.initialFuel}</td>
                  <td>{rate.currentFuel}</td>
                  <td>{rate.burnRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No laps recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default FuelBurnCard;
