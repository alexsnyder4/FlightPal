import React, { useState } from 'react';
import { useUserData } from '../UserDataContext';
import { useEvent } from '../EventContext';
import '../CSS/Card.css';

const FlightsCard = () => {
    const { flights, addNewFlight, deleteFlight, fetchAircraft, aircraft, isLoading, error } = useUserData();
    const eventEmitter = useEvent();
    const [showForm, setShowForm] = useState(false);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);
    const [formError, setFormError] = useState(null);

    // Form state
    const [duration, setDuration] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [stopLocation, setStopLocation] = useState('');
    const [date, setDate] = useState('');
    const [crewMembers, setCrewMembers] = useState([{ name: '', role: '' }]);
    const [selectedAircraft, setSelectedAircraft] = useState('');

    // Toggles the add flight form
    const handleAddFlight = () => setShowForm(!showForm);

    // Toggles delete flight buttons
    const handleToggleDeleteButtons = () => setShowDeleteButtons(!showDeleteButtons);

    // Handles delete confirmation popup
    const handleDeleteFirstStage = (flightId) => {
        setFlightToDelete(flightId);
        setIsConfirmingDelete(true);
    };

    // Handles flight deletion
    const handleConfirmDelete = async () => {
        try {
            await deleteFlight(flightToDelete);
            eventEmitter.notify('flightDeleted', flightToDelete);
            setIsConfirmingDelete(false);
            setShowDeleteButtons(false);
        } catch (err) {
            setFormError('Failed to delete flight');
        }
    };

    // Cancel delete confirmation
    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
        setFlightToDelete(null);
    };

    // Add new flight and refresh aircraft list
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newFlight = {
            aircraftId: selectedAircraft,
            duration,
            startLocation,
            stopLocation,
            date,
            crewMembers: crewMembers.filter(member => member.name && member.role),
        };

        try {
            await addNewFlight(newFlight);
            eventEmitter.notify('flightAdded', newFlight);
            setShowForm(false);
            setDuration('');
            setStartLocation('');
            setStopLocation('');
            setDate('');
            setCrewMembers([{ name: '', role: '' }]);
            setSelectedAircraft('');
            await fetchAircraft();
        } catch (err) {
            setFormError('Failed to add flight');
        }
    };

    const removeCrewMember = (index) => {
        const updatedCrewMembers = crewMembers.filter((_, i) => i !== index);
        setCrewMembers(updatedCrewMembers);
    };

    const addCrewMember = () => {
        setCrewMembers([...crewMembers, { name: '', role: '' }]);
    };

    const handleCrewMemberChange = (index, event) => {
        const updatedCrewMembers = crewMembers.map((member, i) =>
            i === index ? { ...member, [event.target.name]: event.target.value } : member
        );
        setCrewMembers(updatedCrewMembers);
    };

    if (isLoading) return <div>Loading flights...</div>;
    if (error) return <div>Error loading data: {error}</div>;

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
                            {aircraft.map((aircraft) => (
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
                    <p>{formError}</p>
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
                            {showDeleteButtons && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight, index) => (
                            <tr key={flight.flightId} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
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
                                        <button className="button--delete" onClick={() => handleDeleteFirstStage(flight.flightId)}>
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No flights available</p>
            )}

            {isConfirmingDelete && (
                <div className="modal-overlay" onClick={handleCancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to DELETE this flight?</h3>
                        <button className="button" onClick={handleConfirmDelete}>Yes</button>
                        <button className="button" onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightsCard;
