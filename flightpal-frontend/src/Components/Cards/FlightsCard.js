import React, { useEffect, useState, useCallback} from 'react';
import { getUserAircraft, getFlightsByUserId, deleteFlightByFlightId, addFlight } from '../../Services/api';
import { useEvent } from '../EventContext';
import '../CSS/Card.css';

const FlightsCard = ({ userId }) => {
    const eventEmitter = useEvent(); // Access the event emitter
    const [flights, setFlights] = useState([]);
    const [flightsError, setFlightsError] = useState(null);
    const [error, setError] = useState(null);

    // Flight data management
    const [duration, setDuration] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [stopLocation, setStopLocation] = useState('');
    const [date, setDate] = useState('');
    const [crewMembers, setCrewMembers] = useState([{ name: '', role: '' }]);
    const [selectedAircraft, setSelectedAircraft] = useState('');
    const [aircraftList, setAircraftList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [aircraftError, setAircraftError] = useState(null);

    // Toggle delete buttons visibility
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);

    // Confirmation popup state
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);

    

    const fetchFlights = useCallback(async () => {
        try {
          const flightsResponse = await getFlightsByUserId(userId);
          if (flightsResponse.data.length === 0) {
            setFlightsError('No flights yet');
          } else {
            setFlights(flightsResponse.data);
          }
        } catch (err) {
          setFlightsError('Failed to fetch flight data');
        }
      }, [userId]);
    
      // Fetch aircraft
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

    // Fetch flights when component loads
    // Fetch aircraft data when component loads
    useEffect(() => {
        fetchFlights();
        fetchAircraft();
    }, [userId, fetchFlights, fetchAircraft]);

    // Toggles Add Flight Form
    const handleAddFlight = () => {
        setShowForm(!showForm);
    };

    // Toggles Delete Flight Buttons
    const handleToggleDeleteButtons = () => {
        setShowDeleteButtons(!showDeleteButtons);
    };

    // Handles the delete confirmation popup
    const handleDeleteFirstStage = (flightId) => {
        setFlightToDelete(flightId); // Set the flight to be deleted
        setIsConfirmingDelete(true); // Show confirmation popup
    };

    // Handles confirmation of delete action
    const handleConfirmDelete = async (flightId) => {
        try {
            await deleteFlightByFlightId(flightToDelete); // API call to delete the flight
            setIsConfirmingDelete(false); // Close confirmation popup
            setShowDeleteButtons(false); // Hide delete buttons

            // Notify other components that a flight has been deleted
            eventEmitter.notify('flightDeleted', flightId);

            // Re-fetch flights after deletion
            fetchFlights();

        } catch (err) {
            setError('Failed to delete flight');
        }
    };

    // Cancels the delete confirmation
    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
        setFlightToDelete(null);
    };

    // Handles Delete button to remove specified crew member
    const removeCrewMember = (index) => {
        // Filter out the crew member at the specified index
        const updatedCrewMembers = crewMembers.filter((_, i) => i !== index);
        setCrewMembers(updatedCrewMembers); // Update the state with the filtered list
    };

    // Adds a blank form for a crew member
    const addCrewMember = () => {
        setCrewMembers([...crewMembers, { name: '', role: '' }]);
    };

    const handleCrewMemberChange = (index, event) => {
        const updatedCrewMembers = crewMembers.map((member, i) =>
            i === index ? { ...member, [event.target.name]: event.target.value } : member
        );
        setCrewMembers(updatedCrewMembers);
    };

    // Adds flight data to DB, clears the form, and toggles visibility to false;
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newFlight = {
            userId,
            aircraftId: selectedAircraft,
            duration,
            startLocation,
            stopLocation,
            date,
            crewMembers: crewMembers.filter(member => member.name && member.role), // Filter out empty crew members
        };

        try {
            // Send the new flight data to the backend
            const response = await addFlight({ ...newFlight, userId: userId });

            setFlights([...flights, response.data]);

            // Clear the form fields and hide the form
            setSelectedAircraft('');
            setDuration('');
            setStartLocation('');
            setStopLocation('');
            setDate('');
            setCrewMembers([{ name: '', role: '' }]);;
            setShowForm(false);

            eventEmitter.notify('flightAdded', response.data)
            await fetchAircraft(); // Refresh the aircraft data after submitting the flight

        } catch (err) {
            setError('Failed to add flight information');
        }
    };

    return (
        <div className='card flights-card card-medium'>
            <h3>Flight Information</h3>
            <button className='button' onClick={handleAddFlight}>
                {showForm ? 'Cancel' : 'Add Flight'}
            </button>
            <button className='button delete-toggle-btn' onClick={handleToggleDeleteButtons}>
                {showDeleteButtons ? 'Cancel' : 'Delete Flight'}
            </button>

            {showForm && (
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>Aircraft:</label>
                        <select
                            value={selectedAircraft}
                            onChange={(e) => setSelectedAircraft(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Aircraft</option>
                            {aircraftList.map((aircraft) => (
                                <option key={aircraft.aircraftId} value={aircraft.aircraftId}>
                                    {aircraft.manufacturer} {aircraft.model} ({aircraft.role})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Duration (hours):</label>
                        <input
                            type="number"
                            step="0.1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start Location:</label>
                        <input
                            type="text"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Stop Location:</label>
                        <input
                            type="text"
                            value={stopLocation}
                            onChange={(e) => setStopLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <h3>Crew Members:</h3>
                        {crewMembers.map((member, index) => (
                            <div key={index}>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={member.name}
                                    onChange={(e) => handleCrewMemberChange(index, e)}
                                    required
                                />
                                <label>Role:</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={member.role}
                                    onChange={(e) => handleCrewMemberChange(index, e)}
                                    required
                                />
                                <button type="button" onClick={() => removeCrewMember(index)}>Remove</button>
                            </div>
                        ))}

                        <button type="button" className="button" onClick={addCrewMember}>Add Crew Member</button>
                    </div>
                    <button className="button--submit" type="submit">Submit</button>
                    <p>{error}{aircraftError}</p>
                </form>
            )}

            {flights.length > 0 ? (
                <table className='flightTable'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Aircraft</th>
                            <th>Flight Hours</th>
                            <th>Start Location</th>
                            <th>Stop Location</th>
                            <th>Crew Members</th>
                            {showDeleteButtons && <th>Actions</th>} {/* Show Actions column when delete is active */}
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight, index) => (
                            <tr key={flight.FlightId} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                                <td>{flight.date}</td>
                                <td>{flight.aircraftId}</td>
                                <td>{flight.duration}</td>
                                <td>{flight.startLocation}</td>
                                <td>{flight.stopLocation}</td>
                                <td>
                                    {flight.crewMembers?.map((member, i) => (
                                        <div key={i}>
                                            <p>{member.name} - {member.role}</p>
                                        </div>
                                    ))}
                                </td>
                                {showDeleteButtons && (
                                    <td>
                                        <button className="button--delete" onClick={() => { handleDeleteFirstStage(flight.flightId); }}>
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{flightsError}</p>
            )}

            {/* Delete confirmation modal */}
            {isConfirmingDelete && (
                <div className="modal-overlay" onClick={handleCancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to DELETE this flight?</h3>
                        <button className="button" onClick={() => handleConfirmDelete(flightToDelete)}>Yes</button>
                        <button className="button" onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightsCard;
