import React, { useState } from 'react';
import '../CSS/Card.css'
import '../CSS/Login.css';
import '../CSS/EditCardModal.css';

const EditCards = ({ CardsList, addCard, removeCard, activeCards, toggleResize, activeResize, toggleDraggable, activeDraggable}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle click outside the modal to close
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleCloseModal();
    }
  };

  const handleCardToggle = (cardId) => {
    if (activeCards.includes(cardId)) {
      removeCard(cardId); // Remove the card if it's already active
    } else {
      addCard(cardId); // Add the card if it's not already active
    }
  };

  return (
    <div className="card edit-card">
      <button className="button button--edit" onClick={handleOpenModal}>
        Edit Cards
      </button>

      <button className='button' onClick={toggleResize}>
        {activeResize ? 'Disable Resize' : 'Enable Resize'}
      </button>

      <button className='button' onClick={toggleDraggable}>
        {activeDraggable ? 'Lock Cards' : 'Unlock Cards'}
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <h2>Select Cards to Display</h2>

            {/* Carousel for card previews */}
            <div className="carousel">
              {CardsList.map((card) => (
                <div
                  key={card.id}
                  className={`card-item ${card.size} ${activeCards.includes(card.id) ? 'selected' : ''
                    }`}
                  onClick={() => handleCardToggle(card.id)}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className={`card-image ${activeCards.includes(card.id) ? 'greyed-out' : ''
                      }`}
                  />
                  <p>{card.name}</p>
                </div>
              ))}
            </div>
            <button className='button' onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCards;
