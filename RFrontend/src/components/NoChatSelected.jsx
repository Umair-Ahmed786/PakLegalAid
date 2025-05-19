import React from "react";
import { useChat } from '../context/chat/ChatProvider'; // Import the chat context
import { Spinner } from 'react-bootstrap'; // Bootstrap spinner for loading state
import { useNavigate } from "react-router-dom";

// const NoChatSelected = ({ setCurrentChat }) => {
const NoChatSelected = () => {
  const { addChat, loading, setCurrentChat } = useChat(); // Get the addChat function and loading state from the context
  // const { chats, CurrentChat, setCurrentChat } = useChat();
  let navigate = useNavigate()

  const handleNewChat = async () => {
    try {
      // Create a new chat
      const newChat = await addChat(); // Create the new chat

      // Set the current chat to the newly created chat
      setCurrentChat(newChat);
      navigate('/about')

    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <div 
      className="fluid-container"
      style={{
        backgroundColor: '#f7f8fa', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        padding: '3rem 0',
        fontFamily: "'Roboto', sans-serif"
      }}
    >
      <h4 
        style={{
          color: '#045912', 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          fontWeight: '600',
          marginBottom: '2rem'
        }}
      >
        Please select a chat to begin.
      </h4>

      <p
        style={{
          color: '#555',
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          fontWeight: '400'
        }}
      >
        Or start a new chat to get started.
      </p>

      <button
        onClick={handleNewChat}
        disabled={loading}
        className="btn btn-lg"
        style={{
          backgroundColor: '#28a745', // Green background for the button
          color: '#fff',
          padding: '12px 30px',
          border: 'none',
          borderRadius: '50px', // Rounded button corners
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for button
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)'; // Hover effect - scaling
          e.target.style.backgroundColor = '#218838'; // Darker green on hover
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)'; // Reset scale
          e.target.style.backgroundColor = '#28a745'; // Reset background color
        }}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" style={{ marginRight: '10px' }} /> Creating...
          </>
        ) : (
          "New Chat"
        )}
      </button>
    </div>
  );
};

export default NoChatSelected;
