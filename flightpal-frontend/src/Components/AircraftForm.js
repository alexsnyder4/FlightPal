import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addAircraftToUser } from '../Services/api';
import './CSS/Card.css';

const AircraftForm = ({onAircraftAdded}) => {
    const {userId} = useParams();
    const [model, setModel] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [currentHours, setCurrentHours] = useState('');
    const [requiredHours, setRequiredHours] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate the currentHours and requiredHours
        const parsedCurrentHours = parseFloat(currentHours);
        const parsedRequiredHours = parseInt(requiredHours, 10);

        if (isNaN(parsedCurrentHours) || parsedCurrentHours < 0) {
            setError('Please provide a valid positive number for Current Hours.');
            setLoading(false);
            return;
        }

        if (isNaN(parsedRequiredHours) || parsedRequiredHours <= 0) {
            setError('Required Hours must be a positive number.');
            setLoading(false);
            return;
        }

        const aircraftDetails = {
            model,
            manufacturer,
            currentHours: parsedCurrentHours,
            requiredHours: parsedRequiredHours,
            role,
            userId,
        };

        try {
            console.log('UserId:', userId);  
            console.log('Aircraft details:', aircraftDetails);  
            // Add aircraft to user
            await addAircraftToUser(userId, aircraftDetails);
            setSuccess('Aircraft successfully added!');  
            clearForm();
            if (onAircraftAdded && typeof onAircraftAdded === 'function') {
                onAircraftAdded(); // Refresh the aircraft list
            } else {
                console.error('onAircraftAdded is not a function');
            }
        } catch (error) {
            console.error('Error adding aircraft:', error);
            setError('Failed to add aircraft. Please try again.');
        }

        setLoading(false);
    };

    const clearForm = () => {
        setModel('');
        setManufacturer('');
        setCurrentHours('');
        setRequiredHours('');
        setRole('');
    };

    return (
        <form className='aircraftForm' onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Aircraft Model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
                required 
            />
            <input
                type="text"
                placeholder="Manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Current Hours"
                value={currentHours}
                onChange={(e) => setCurrentHours(e.target.value)}
                required
            />
            <input 
                type="number" 
                placeholder="Required Hours" 
                value={requiredHours} 
                onChange={(e) => setRequiredHours(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required 
            />
            <button className="button--submit" disabled={loading}>
                {loading ? 'Adding...' : 'Submit'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default AircraftForm;
