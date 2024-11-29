import React, { useState } from "react";

const FuelBurnCard = ({ aircraftData }) => {
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [initialFuel, setInitialFuel] = useState("");
  const [flightDuration, setFlightDuration] = useState("");
  const [result, setResult] = useState(null);

  const calculateFuel = () => {
    const burnRateValue = burnRate || aircraftData.find(a => a.aircraft === selectedAircraft)?.defaultBurnRate || 0;
    const fuelConsumed = burnRateValue * flightDuration;
    const fuelRemaining = initialFuel - fuelConsumed;
    setResult({ fuelConsumed, fuelRemaining });
  };

  return (
    <div className="fuel-burn-card">
      <h2>Fuel Burn Calculator</h2>
      <div>
        <label>Aircraft: </label>
        <select
          value={selectedAircraft}
          onChange={(e) => setSelectedAircraft(e.target.value)}
        >
          <option value="">Select an aircraft</option>
          {aircraftData.map((aircraft) => (
            <option key={aircraft.aircraft} value={aircraft.aircraft}>
              {aircraft.aircraft}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Initial Fuel (gallons): </label>
        <input
          type="number"
          value={initialFuel}
          onChange={(e) => setInitialFuel(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Burn Rate (gallons/hour): </label>
        <input
          type="number"
          value={burnRate}
          onChange={(e) => setBurnRate(Number(e.target.value))}
          placeholder={`Default: ${
            selectedAircraft &&
            aircraftData.find(a => a.aircraft === selectedAircraft)?.defaultBurnRate
          }`}
        />
      </div>
      <div>
        <label>Flight Duration (hours): </label>
        <input
          type="number"
          value={flightDuration}
          onChange={(e) => setFlightDuration(Number(e.target.value))}
        />
      </div>
      <button onClick={calculateFuel}>Calculate</button>
      {result && (
        <div>
          <h3>Results:</h3>
          <p>Fuel Consumed: {result.fuelConsumed.toFixed(2)} gallons</p>
          <p>Fuel Remaining: {result.fuelRemaining.toFixed(2)} gallons</p>
        </div>
      )}
    </div>
  );
};

export default FuelBurnCard;
