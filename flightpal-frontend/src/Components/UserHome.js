import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AircraftRequirementsCard from './Cards/AircraftRequirementsCard';
import EditCards from './Cards/EditCards';
import FlightsCard from './Cards/FlightsCard';
import UserInfoCard from './Cards/UserInfoCard';
import WeatherCard from './Cards/WeatherCard';
import CardsList from './CardsList';
import ChartCard from './Cards/ChartCard';
import GridLayout from 'react-grid-layout';
import './CSS/Login.css';
import './CSS/Card.css';
import 'react-grid-layout/css/styles.css';  // Required for react-grid-layout
import 'react-resizable/css/styles.css';    // Required for resizing



const UserHome = () => {
  const { userId } = useParams(); // Extract user ID from the URL


  //const [isAuthenticated, setIsAuthenticated] = useState(true); // Replace with actual auth check
  // Card layout configuration for react-grid-layout
  const [layout, setLayout] = useState([
    { i: 'userInfo',                    x: 0, y: 0, w: 2, h: 1},
    { i: 'aircraftRequirements',        x: 1, y: 0, w: 1, h: 3},
    { i: 'flights',                     x: 2, y: 0, w: 1, h: 3},
    { i: 'weather',                     x: 0, y: 2, w: 1, h: 4},
    { i: 'chart',                       x: 1, y: 2, w: 1, h: 3},
  ]);
  // Map of sizes for individual cards to reference when adding cards
  const cardSizeMap = {
    userInfo:             { w: 2, h: 1, minW: 2, minH: 1, maxW: 3, maxH: 4 },
    aircraftRequirements: { w: 2, h: 3, minW: 1, minH: 3, maxW: 3, maxH: 4 },
    flights:              { w: 3, h: 3, minW: 3, minH: 3, maxW: 5, maxH: 5 },
    weather:              { w: 3, h: 3, minW: 1, minH: 3, maxW: 5, maxH: 5 },
    chart:                { w: 2, h: 3, minW: 1, minH: 3, maxW: 5, maxH: 5 },
  };
  
  // Card management
  const [activeCards, setActiveCards] = useState(['userInfo']); // Start with userInfo card always active
  const [activeResize, setActiveResize] = useState(false); // T/F for resizing cards option
  const [activeDraggable, setActiveDraggable] = useState(false); // T/F for dragging cards option
  const navigate = useNavigate();


  const toggleDraggable = () => {
    setActiveDraggable(!activeDraggable); // Toggle draggable state
  }
  const toggleResize = () => {
    setActiveResize(!activeResize); // Toggle the resizing state
  };

  // Add card function to manage the selected cards
  const addCard = (cardName) => {
    if (!activeCards.includes(cardName)) {
      setActiveCards([...activeCards, cardName]);
      // Define the layout for the new card based on its type
    const newCardLayout = {
      i: cardName,
      x: 0,  // Start at the first column
      y: Infinity,  // Automatically place in the next available row
      ...cardSizeMap[cardName],  // Apply the unique width, height, and constraints for each card
    };

    // Add the new layout to the existing layout
    setLayout([...layout, newCardLayout]);
    }
  };

  /*
  // Notify listeners (cards) about a deletion
  const handleDelete = (itemId) => {
    // Perform deletion logic 
    eventEmitter.notify('itemDeleted', itemId); // Notify all listeners
  };
  */
  const removeCard = (cardName) => {
    setActiveCards(activeCards.filter(card => card !== cardName));
  };

  const onLayoutChange = (newLayout) => {
    console.log(newLayout);  // Check the new layout dimensions in the console
    setLayout(newLayout);
  };

  const handleLogout = () => {
    // Clear authentication data
    //setIsAuthenticated(false);

    // Redirect to login page
    navigate('/login');
  };



  return (
    <div className='userHome-container'>
      <h1 className='title'>User Home</h1>

      {/* Grid Layout to display cards */}
      <div className='layout-container'>
        <GridLayout
          className="layout"
          layout={layout}
          cols={10}  // Maximum 3 cards per row
          rowHeight={150}
          width={2000}  // Total width of the grid container
          onLayoutChange={onLayoutChange}
          isResizable={activeResize}
          isDraggable={activeDraggable}
        >
          {/* Render Cards Dynamically */}
          {activeCards.includes('userInfo') && (
            <div key="userInfo">
              <UserInfoCard userId={userId} />
            </div>
          )}

          {activeCards.includes('aircraftRequirements') && (
            <div key="aircraftRequirements">
              <AircraftRequirementsCard userId={userId} />
            </div>
          )}

          {activeCards.includes('flights') && (
            <div key="flights">
              <FlightsCard userId={userId} />
            </div>
          )}

          {activeCards.includes('weather') && (
            <div key="weather">
              <WeatherCard />
            </div>
          )}

          {activeCards.includes('chart') && (
            <div key="chart">
              <ChartCard userId={userId} />
            </div>
          )}
        </GridLayout>
      </div>
      {/* Edit Card Button to Add/Remove Cards */}
      <EditCards
        CardsList={CardsList}
        addCard={addCard}
        removeCard={removeCard}
        activeCards={activeCards}
        toggleResize={toggleResize} // Pass the toggle function to EditCards
        activeResize={activeResize} // Pass the state to show the current status
        toggleDraggable={toggleDraggable}
        activeDraggable={activeDraggable}
      />

      <button className='logoutBtn' onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default UserHome;
