import React, { useEffect, useState } from 'react';
import { getUserById } from '../../Services/api';
import '../CSS/Card.css';

const UserInfoCard = ({ userId }) => {
    const [user, setUser] = useState(null); // User data fetched
    const [error, setUserError] = useState(null);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const userResponse = await getUserById(userId);
                setUser(userResponse.data);
            } catch (err) {
                setUserError('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, [userId]);
    const handleImageClick = () => {
        // Handle profile picture logic here if needed in the future
        alert("Profile picture functionality not yet implemented");
    };
    console.log("Current mode:", process.env.NODE_ENV); //remove after testing

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="card userinfo-card card-small">
            <div className='userinfo-text'>
                <h2>Welcome, {user?.fName || 'User'}!</h2>
                <p>We're glad to have you here.</p>
            </div>
            <div className="profileppic-container">
                {/* Circular button for the photo placeholder */}
                <button className="button--profilepic" onClick={handleImageClick}>
                    {/* This button will use a default background image */}
                </button>
            </div>
        </div>
    );
};

export default UserInfoCard;
