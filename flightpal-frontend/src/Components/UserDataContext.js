
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  getUserById,
  getFlightsByUserId,
  addFlight,
  deleteFlightByFlightId,
  getUserAircraft,
  addAircraftToUser,
  deleteAircraftByAircraftId,
} from '../Services/api'; 

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ userId, children }) => {
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data by ID
  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserById(userId);
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data');
    }
  }, [userId]);

  // Fetch user's flights
  const fetchFlights = useCallback(async () => {
    try {
      const response = await getFlightsByUserId(userId);
      setFlights(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch flights');
    }
  }, [userId]);

  // Fetch user's aircraft
  const fetchAircraft = useCallback(async () => {
    try {
      const response = await getUserAircraft(userId);
      setAircraft(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch aircraft data');
    }
  }, [userId]);

  // Add a new flight
  const addNewFlight = async (flightInfo) => {
    try {
      const response = await addFlight(flightInfo);
      setFlights((prevFlights) => [...prevFlights, response.data]);
    } catch (err) {
      setError('Failed to add flight');
    }
  };

  // Delete a flight
  const deleteFlight = async (flightId) => {
    try {
      await deleteFlightByFlightId(flightId);
      setFlights((prevFlights) => prevFlights.filter((flight) => flight.flightId !== flightId));
    } catch (err) {
      setError('Failed to delete flight');
    }
  };

  // Add aircraft to the user
  const addAircraft = async (aircraftDetails) => {
    try {
      const response = await addAircraftToUser(userId, aircraftDetails);
      setAircraft((prevAircraft) => [...prevAircraft, response.data]);
    } catch (err) {
      setError('Failed to add aircraft');
    }
  };

  // Delete aircraft from the user
  const deleteAircraft = async (aircraftId) => {
    try {
      await deleteAircraftByAircraftId(userId, aircraftId);
      setAircraft((prevAircraft) => prevAircraft.filter((aircraft) => aircraft.aircraftId !== aircraftId));
    } catch (err) {
      setError('Failed to delete aircraft');
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUser(), fetchFlights(), fetchAircraft()]);
      setIsLoading(false);
    };

    fetchData();
  }, [fetchUser, fetchFlights, fetchAircraft]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        flights,
        aircraft,
        isLoading,
        error,
        addNewFlight,
        deleteFlight,
        addAircraft,
        deleteAircraft,
        fetchUser,
        fetchFlights,
        fetchAircraft,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
