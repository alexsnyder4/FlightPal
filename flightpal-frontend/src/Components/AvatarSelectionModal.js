import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/AvatarSelectionModal.css';

const AvatarSelectionModal = ({ onClose, onAvatarSelect }) => {
    const avatarList = [
        '/AvatarImages/Avatar1.png',
        '/AvatarImages/Avatar2.png',
        '/AvatarImages/Avatar3.png',
        '/AvatarImages/Avatar4.png',
        '/AvatarImages/Avatar5.png',
        '/AvatarImages/Avatar6.png',
        '/AvatarImages/Avatar7.png',
        '/AvatarImages/Avatar8.png',
        '/AvatarImages/Avatar9.png',
        '/AvatarImages/Avatar10.png',
    ];

    return ReactDOM.createPortal(
        <>
            {/* Placeholder for greying out the background */}
            <div className="modal-overlay" onClick={onClose}></div>

            {/* Modal content */}
            <div class="relative-wrapper">
                <div className="modal-container">
                    <h2 className='modalheader'>Select Your Profile Picture</h2>
                    <button className='close' onClick={onClose}></button>
                    <div className="modalcontent">
                        {/* Placeholder button for importing a photo */}
                        <button
                            className="button--profilepic"
                            onClick={() => alert('Import photo functionality still in development!')}
                        >
                            <img src='./AvatarImages/ImportAvatar.png' alt='Import Avatar' className='avatar-image'/>
                        </button>

                        {/* Render buttons for each stock avatar */}
                        {avatarList.map((avatar, index) => (
                            <button
                                key={index}
                                className="button--profilepic"
                                onClick={() => {
                                    onAvatarSelect(avatar);
                                    onClose();
                                }}
                            >
                                <img src={avatar} alt={`Avatar ${index + 1}`} className="avatar-image" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AvatarSelectionModal;
