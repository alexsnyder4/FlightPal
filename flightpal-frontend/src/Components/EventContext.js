import React, { createContext, useContext } from 'react';
import EventManager from './EventManager'; // Assuming EventEmitter is defined in this file or imported

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  return (
    <EventContext.Provider value={EventManager}>
      {children}
    </EventContext.Provider>
  );
};
