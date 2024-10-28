import React, { useState, useEffect } from 'react';
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
  const { userId } = useParams();
  const navigate = useNavigate();
  const [layout, setLayout] = useState(null);
  const [activeCards, setActiveCards] = useState([]);
  const [activeResize, setActiveResize] = useState(false);
  const [activeDraggable, setActiveDraggable] = useState(false);

  useEffect(() => {
    // Load layout and activeCards from local storage on mount
    const savedLayout = JSON.parse(localStorage.getItem(`userLayout-${userId}`));
    const savedActiveCards = JSON.parse(localStorage.getItem(`userActiveCards-${userId}`));

    if (savedLayout) {
      console.log("Loaded layout from local storage:", savedLayout);
      setLayout(savedLayout);
    } else {
      const defaultLayout = [
        { i: 'userInfo', x: 0, y: 0, w: 2, h: 1 },
        { i: 'aircraftRequirements', x: 1, y: 0, w: 1, h: 3 },
        { i: 'flights', x: 2, y: 0, w: 1, h: 3 },
        { i: 'weather', x: 0, y: 2, w: 1, h: 4 },
        { i: 'chart', x: 1, y: 2, w: 1, h: 3 },
      ];
      console.log("Setting default layout:", defaultLayout);
      setLayout(defaultLayout);
    }

    // Set default active cards if none are saved
    setActiveCards(savedActiveCards || ['userInfo']);
  }, [userId]);

  const cardSizeMap = {
    userInfo: { w: 2, h: 1, minW: 2, minH: 1, maxW: 10, maxH: 3 },
    aircraftRequirements: { w: 2, h: 3, minW: 1, minH: 3, maxW: 4, maxH: 4 },
    flights: { w: 3, h: 3, minW: 3, minH: 3, maxW: 6, maxH: 6 },
    weather: { w: 3, h: 3, minW: 1, minH: 3, maxW: 6, maxH: 6 },
    chart: { w: 2, h: 3, minW: 1, minH: 3, maxW: 6, maxH: 6 },
  };

  const toggleDraggable = () => setActiveDraggable(!activeDraggable);
  const toggleResize = () => setActiveResize(!activeResize);

  const addCard = (cardName) => {
    if (!activeCards.includes(cardName)) {
      const newActiveCards = [...activeCards, cardName];
      updateActiveCards(newActiveCards);  // Save updated active cards
  
      // Define layout for the new card based on its type
      const newCardLayout = {
        i: cardName,
        x: 0,  // Default column
        y: Infinity,  // Automatically place in the next available row
        ...cardSizeMap[cardName],  // Get dimensions from cardSizeMap
      };
  
      // Update layout to include the new card layout
      const newLayout = [...layout, newCardLayout];
      setLayout(newLayout);
      localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
    }
  };

  const removeCard = (cardName) => {
    const newActiveCards = activeCards.filter(card => card !== cardName);
    updateActiveCards(newActiveCards);  // Save updated active cards
  
    // Update layout to remove the layout for the card being removed
    const newLayout = layout.filter(item => item.i !== cardName);
    setLayout(newLayout);
    localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
  };

  const updateActiveCards = (newActiveCards) => {
    setActiveCards(newActiveCards);
    console.log("Active cards updated:", newActiveCards);  // Log current active cards
    localStorage.setItem(`userActiveCards-${userId}`, JSON.stringify(newActiveCards));
    console.log("Saved active cards to local storage:", newActiveCards);
  };
  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className='userHome-container'>
      <h1 className='title'>User Home</h1>
      <div className='layout-container'>
        <GridLayout
          className="layout"
          layout={layout}
          cols={10}
          rowHeight={150}
          width={2000}
          onLayoutChange={onLayoutChange}
          isResizable={activeResize}
          isDraggable={activeDraggable}
        >
          {activeCards.includes('userInfo') && (
            <div key="userInfo"><UserInfoCard userId={userId} /></div>
          )}
          {activeCards.includes('aircraftRequirements') && (
            <div key="aircraftRequirements"><AircraftRequirementsCard userId={userId} /></div>
          )}
          {activeCards.includes('flights') && (
            <div key="flights"><FlightsCard userId={userId} /></div>
          )}
          {activeCards.includes('weather') && (
            <div key="weather"><WeatherCard /></div>
          )}
          {activeCards.includes('chart') && (
            <div key="chart"><ChartCard userId={userId} /></div>
          )}
        </GridLayout>
      </div>
      <EditCards
        CardsList={CardsList}
        addCard={addCard}
        removeCard={removeCard}
        activeCards={activeCards}
        toggleResize={toggleResize}
        activeResize={activeResize}
        toggleDraggable={toggleDraggable}
        activeDraggable={activeDraggable}
      />
      <button className='logoutBtn' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserHome;
