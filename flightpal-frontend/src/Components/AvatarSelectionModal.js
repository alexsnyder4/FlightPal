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
                    {/* Create a button that triggers hidden input click */}
                    <button
                        className="button--profilepic button--profilepic--mini"
                        onClick={() => {
                            document.getElementById('file-upload').click(); // Programmatically trigger the file input
                        }}
                    >
                        <img
                            src="/AvatarImages/ImportAvatar.png" // Replace with your desired image
                            alt="Upload Avatar"
                            className="avatar-image"
                        />
                    </button>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*" // Accept only image files
                        style={{ display: "none" }} // Hide the input
                        onChange={(e) => console.log(e.target.files[0])} // Handle file selection
                    />
                        

                        {/* Render buttons for each stock avatar */}
                        {avatarList.map((avatar, index) => (
                            <button
                                key={index}
                                className="button--profilepic button--profilepic--mini"
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
