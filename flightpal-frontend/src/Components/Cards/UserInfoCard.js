import React, { useEffect, useState } from 'react';
import { getUserById } from '../../Services/api';
import AvatarSelectionModal from '../AvatarSelectionModal';
import '../CSS/Card.css';
import '../CSS/EditCardModal.css';


const UserInfoCard = ({ userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null); // User data fetched
    const [error, setUserError] = useState(null);
    const [avatar, setAvatar] = useState(null);

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



    const onAvatarSelect = (avatar) => {
        setAvatar(avatar)
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="card userinfo-card card-small">
            {/* Welcome Message */}
            <div className='userinfo-text'>
                <h2>Welcome, {user?.fName || 'User'}!</h2>
                <p>We're glad to have you here.</p>
            </div>

            {/* Buttom to display profile picture and also open popup window to choose default or import a picture */}
                <button className="button--profilepic" onClick={handleOpenModal}>
                <img
                        src={avatar || '/AvatarImages/Avatar1.png'} // Default avatar
                        alt="Profile"
                        className="profilepic"
                    />
                </button>
            {/* Modal for avatar selection */}
            {isModalOpen && (
                <AvatarSelectionModal
                    onClose={handleCloseModal}
                    onAvatarSelect={onAvatarSelect}
                />
            )}
        </div>
    );
};

export default UserInfoCard;
