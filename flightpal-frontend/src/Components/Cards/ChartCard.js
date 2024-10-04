import React, { useState, useEffect, useCallback } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../CSS/Card.css';
import '../CSS/Chart.css';
import { getUserAircraft } from '../../Services/api'; // Assume this is where you fetch the aircraft data

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AircraftChartCard = ({ userId }) => {
  const [userAircraftData, setUserAircraftData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('hours'); // Default tab to 'hours'
  const [error, setError] = useState(null);

  const fetchAircraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const userAircraftData = await getUserAircraft(userId);
      if (userAircraftData.data.length === 0) {
        setError('No aircraft yet');
      } else {
        setUserAircraftData(userAircraftData.data);
        setError(null);
      }
    } catch (err) {
        setError('Failed to fetch aircraft data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAircraft();
  }, [fetchAircraft]); // userId wrapped in an array as dependency

  if (isLoading) {
    return <div>Loading chart data...</div>;
  }
  
  if (error) {
    return <div>{error}</div>; // Display error message if an error occurs
  }

  if (userAircraftData.length === 0) {
    return <div>No aircraft data available</div>;
  }

  const aircraftNames = userAircraftData.map(aircraft => aircraft.model);
  const hoursFlown = userAircraftData.map(aircraft => aircraft.currentHours);

  // Data for Pie Chart (Hours flown by aircraft)
  const pieData = {
    labels: aircraftNames,
    datasets: [
      {
        label: 'Hours Flown',
        data: hoursFlown,
        backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
        hoverOffset: 4,
      },
    ],
  };

  // Data for Bar Chart (Same hours flown, different visualization)
  const barData = {
    labels: aircraftNames,
    datasets: [
      {
        label: 'Hours Flown',
        data: hoursFlown,
        backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };

  // Render the correct chart based on the active tab
  const renderChart = () => {
    if (currentTab === 'hours') {
      return <Pie data={pieData} options={{ maintainAspectRatio: false }}/>;
    } else if (currentTab === 'bar') {
      return <Bar data={barData} options={{ maintainAspectRatio: false }}/>;
    }
    // Add more chart options as needed
  };

  return (
    <div className="card aircraft-chart-card card-large">
      <div className="tabs">
        {/* Tabs to switch between different charts */}
        <button onClick={() => setCurrentTab('hours')} className={currentTab === 'hours' ? 'active' : ''}>
          Hours Flown (Pie)
        </button>
        <button onClick={() => setCurrentTab('bar')} className={currentTab === 'bar' ? 'active' : ''}>
          Hours Flown (Bar)
        </button>
      </div>

      <div className="chart-content">
        {renderChart()} {/* Render the appropriate chart */}
      </div>
    </div>
  );
};

export default AircraftChartCard;
