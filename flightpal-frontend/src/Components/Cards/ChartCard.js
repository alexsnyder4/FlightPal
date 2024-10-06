import React, { useState, useEffect, useCallback } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../CSS/Card.css';
import '../CSS/Chart.css';
import { useEvent } from '../EventContext';
import { getUserAircraft } from '../../Services/api';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AircraftChartCard = ({ userId }) => {
  const eventEmitter = useEvent();
  const [userAircraftData, setUserAircraftData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('hours'); // Default tab to 'hours'
  const [error, setError] = useState(null);

  const fetchAircraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const userAircraftData = await getUserAircraft(userId);
      if (userAircraftData.data.length === 0) {
        setError('No aircraft data available.');
      } else {
        setUserAircraftData(userAircraftData.data);
        setError(null);
      }
    } catch (err) {
      if (err.response.status === 404)
      {
        setError('No aircraft found.')
      }
      setError('Failed to fetch aircraft data.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAircraft();

    // Handle flight deletion procedure
    const handleFlightDeleted = (flightId) => {
      fetchAircraft(); // Re-fetch user info when a flight is deleted
    };

    // Handle flight addition procedure
    const handleFlightAdded = (flightId) => {
      fetchAircraft();
    }

    eventEmitter.subscribe('flightDeleted', handleFlightDeleted);
    eventEmitter.subscribe('flightAdded', handleFlightAdded);

    // Clean up subscription when the component unmounts
    return () => {
      eventEmitter.unsubscribe('flightDeleted', handleFlightDeleted);
      eventEmitter.unsubscribe('flightAdded', handleFlightAdded);
    };
  }, [eventEmitter, fetchAircraft]); // userId wrapped in an array as dependency

  // Return loading message when data is being fetched
  if (isLoading) {
    return <div>Loading chart data...</div>;
  }
  
  // Return error message when there is an error
  if (error) {
    return (
      <div className="card aircraft-chart-card card-large greyed-out"> {/* Apply greyed-out styling when there's no data */}
        <div className="no-data-message">
          {error} {/* Error or no-data message */}
        </div>
      </div>
    );
  }

  // If there's no data, display a greyed-out card with a "No data" message
  if (userAircraftData.length === 0) {
    return (
      <div className="card aircraft-chart-card card-large greyed-out">
        <div className="no-data-message">
          No aircraft data to display.
        </div>
      </div>
    );
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
    // Additional chart options here
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
        {renderChart()} {/* Render the desired chart */}
      </div>
    </div>
  );
};

export default AircraftChartCard;
