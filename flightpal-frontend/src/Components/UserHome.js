import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserDataProvider } from './UserDataContext'; // Import the UserDataProvider
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
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const UserHome = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [layout, setLayout] = useState(null);
  const [activeCards, setActiveCards] = useState([]);
  const [activeResize, setActiveResize] = useState(false);
  const [activeDraggable, setActiveDraggable] = useState(false);

  useEffect(() => {
    const savedLayout = JSON.parse(localStorage.getItem(`userLayout-${userId}`));
    const savedActiveCards = JSON.parse(localStorage.getItem(`userActiveCards-${userId}`));

    if (savedLayout) {
      setLayout(savedLayout);
    } else {
      const defaultLayout = [
        { i: 'userInfo', x: 0, y: 0, w: 2, h: 1 },
        { i: 'aircraftRequirements', x: 1, y: 0, w: 1, h: 3 },
        { i: 'flights', x: 2, y: 0, w: 1, h: 3 },
        { i: 'weather', x: 0, y: 2, w: 1, h: 4 },
        { i: 'chart', x: 1, y: 2, w: 1, h: 3 },
      ];
      setLayout(defaultLayout);
    }

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
      updateActiveCards(newActiveCards);

      const newCardLayout = {
        i: cardName,
        x: 0,
        y: Infinity,
        ...cardSizeMap[cardName],
      };

      const newLayout = [...layout, newCardLayout];
      setLayout(newLayout);
      localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
    }
  };

  const removeCard = (cardName) => {
    const newActiveCards = activeCards.filter(card => card !== cardName);
    updateActiveCards(newActiveCards);

    const newLayout = layout.filter(item => item.i !== cardName);
    setLayout(newLayout);
    localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
  };

  const updateActiveCards = (newActiveCards) => {
    setActiveCards(newActiveCards);
    localStorage.setItem(`userActiveCards-${userId}`, JSON.stringify(newActiveCards));
  };

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem(`userLayout-${userId}`, JSON.stringify(newLayout));
  };

  const handleLogout = () => navigate('/login');

  return (
    <UserDataProvider userId={userId}> {/* Wrap with UserDataProvider */}
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
    </UserDataProvider>
  );
};

export default UserHome;
