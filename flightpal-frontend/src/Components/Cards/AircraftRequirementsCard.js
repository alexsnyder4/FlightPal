import React, { useEffect, useState, useCallback } from 'react';
import AircraftForm from '../AircraftForm';
import { getUserAircraft, deleteAircraftByAircraftId } from '../../Services/api';
import { useEvent } from '../EventContext';
import '../CSS/Card.css';

const AircraftRequirementsCard = ({ userId }) => {
  const eventEmitter = useEvent();
  const [aircraftList, setAircraftList] = useState([]);
  const [aircraftError, setAircraftError] = useState(null);
  const [showAircraftForm, setShowAircraftForm] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [aircraftToDelete, setAircraftToDelete] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Define fetchAircraft function inside the component
  // Use useCallback to memoize fetchAircraft
  const fetchAircraft = useCallback(async () => {
    try {
      const aircraftResponse = await getUserAircraft(userId);
      if (aircraftResponse.data.length === 0) {
        setAircraftError('No aircraft yet');
      } else {
        setAircraftList(aircraftResponse.data);
      }
    } catch (err) {
      setAircraftError('Failed to fetch aircraft data');
    }
  }, [userId]);

  useEffect(() => {
    fetchAircraft(); // Call fetchAircraft when the component mounts

    // Subscribe to the 'flightDeleted' event
    const handleFlightDeleted = (flightId) => {
      fetchAircraft(); // Re-fetch user info when a flight is deleted
    };

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
  }, [eventEmitter, fetchAircraft]);

  const handleAddAircraft = () => {
    setShowAircraftForm(!showAircraftForm);
  };

  const handleDeleteAircraft = () => {
    setShowDeleteButtons(!showDeleteButtons);
  }

  // Handles the delete confirmation popup
  const handleDeleteFirstStage = (aircraftId) => {
    setAircraftToDelete(aircraftId); // Set the flight to be deleted
    setIsConfirmingDelete(true); // Show confirmation popup
  };
  // Handles confirmation of delete action
  const handleConfirmDelete = async (aircraftToDelete) => {
    try {
      await deleteAircraftByAircraftId(userId, aircraftToDelete); // API call to delete the flight
      setIsConfirmingDelete(false); // Close confirmation popup
      setShowDeleteButtons(false); // Hide delete buttons

      // Notify other components that a flight has been deleted
      eventEmitter.notify('AircraftDeleted', aircraftToDelete);

      // Re-fetch flights after deletion
      fetchAircraft();

    } catch (err) {
      setAircraftError('Failed to delete flight');
    }
  };
  // Cancels the delete confirmation
  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
    setAircraftToDelete(null);
  };

  return (
    <div className='card aircraftreqs-card card-medium'>
      <h3>Aircraft Requirements</h3>
      <button className="button" onClick={handleAddAircraft}>
        {showAircraftForm ? 'Cancel' : 'Add Aircraft'}
      </button>
      <button className="button" onClick={handleDeleteAircraft}>
        {showDeleteButtons ? 'Cancel' : 'Delete Aircraft'}
      </button>
      {showAircraftForm && <AircraftForm onAircraftAdded={fetchAircraft} />} {/* Pass fetchAircraft to AircraftForm */}
      {aircraftError ? (
        <p>{aircraftError}</p>
      ) : (
        <table className='aircraftTable'>
          <thead>
            <tr>
              <th>Aircraft Info</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {aircraftList.map((aircraft, index) => {
              const percentage = (aircraft.currentHours / aircraft.requiredHours) * 100;

              return (
                <tr key={aircraft.aircraftId} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                      <span>
                        {aircraft.manufacturer} {aircraft.model} ({aircraft.role})
                      </span>
                    </div>
                  </td>
                  <td>
                    {aircraft.currentHours || 0} / {aircraft.requiredHours} hours
                  </td>
                  {showDeleteButtons && (
                    <td>
                      <button className="button--delete" onClick={() => { handleDeleteFirstStage(aircraft.aircraftId); }}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}


      {/* Delete confirmation modal */}
      {isConfirmingDelete && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to DELETE this Aircraft?</h3>
            <button className="button" onClick={() => handleConfirmDelete(aircraftToDelete)}>Yes</button>
            <button className="button" onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftRequirementsCard;
