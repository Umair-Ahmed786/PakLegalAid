import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useChat } from "../context/chat/ChatProvider";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import {
  FaBars, FaTimes, FaPlus, FaComment,
  FaEdit, FaTrash, FaChevronDown
} from 'react-icons/fa';

// Import the background image
import bgImage from '../images/BackgroundFlag.jpeg';
import Rename from "./Modals/sidebar/Rename";
import Delete from "./Modals/sidebar/Delete";

// const MySidebar = ({ toggleSidebar, isSidebarCollapsed, setCurrentChat, CurrentChat }) => {
const MySidebar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const { chats, fetchChats, deleteChat, addChat, updateChat, CurrentChat, setCurrentChat} = useChat();

  // Modal states
  const [ShowReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  // In your MenuItem component 
  const [locallySelectedChat, setLocallySelectedChat] = useState(null);
  const navigate = useNavigate();

  const handleRenameClick = (chat) => {
    setSelectedChat(chat);
    setNewTitle(chat.title);
    setShowReplaceModal(true);
  };

  const handleUpdateChat = async () => {
    if (selectedChat && newTitle.trim()) {
      await updateChat(selectedChat._id, newTitle.trim());
      setShowReplaceModal(false);
      setSelectedChat(null);
    }
  };

  const handleNewChat = async () => {
    const newChat = await addChat(); // Add a new chat
    console.log(`new chat: ${newChat}`)
    setCurrentChat(newChat); // Set the newly created chat as the current chat

    navigate("/about"); // Navigate to the "about" page to start the chat
  };

  const handleDeleteClick = (chat) => {
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete._id);
      setCurrentChat(null)
      handleCloseModal();
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div
      className="container-fluid mx-auto"
      style={{
        display: "flex",
        height: isSidebarCollapsed ? "8.5vh" : '100vh',
        width: "2em",
        position: 'fixed',
        zIndex: 1,
        marginLeft: '0',
        padding: '0',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Sidebar collapsed={isSidebarCollapsed}>
        <Menu iconShape="square">
          <MenuItem onClick={toggleSidebar} style={{ cursor: "pointer" }}>
            {isSidebarCollapsed ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>☰</div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>✖</div>
            )}
          </MenuItem>

          {!isSidebarCollapsed && (
              // <MenuItem
              <button
              className="btn btn-lg"
                onClick={handleNewChat}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  width: '80%',
                  color: 'white',
                  backgroundColor: '#0b8c2d',
                  margin: '8px',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginLeft: '13%'
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
             
             
                <FaPlus style={{ fontSize: '14px', marginRight: '2%' }} />
                New Chat
             
              </button>
          )}

          {!isSidebarCollapsed &&
            chats
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((chat) => {
                // const isActive = chat._id === locallySelectedChat || chat._id === CurrentChat?._id;
                const isActive = chat._id === CurrentChat?._id;

                return (
                  <MenuItem
                    key={chat._id}
                    style={{
                      textAlign: 'left',
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'white' : 'darkgreen', // white text for active chat
                      backgroundColor: isActive ? '#0b8c2d' : 'transparent', // dark green background for active chat
                      borderLeft: isActive ? '4px solid #045912' : 'none',
                      transition: 'all 0.3s ease',
                      paddingLeft: '10%',
                      // width: '80%',
                      // margin: '13%'

                    }}
                    onClick={() => {
                      setCurrentChat(chat); // Update state
                      console.log("here is current chat id: ", CurrentChat)
                      console.log("Setting chat:", chat); // Debug log

                      setLocallySelectedChat(chat._id);
                      setTimeout(() => navigate('/about'), 50); // Small delay
                    }}
                    icon={<FaComment />}
                  >
                    <div style={{ display: 'inline' }}>
                      {chat.title}
                    </div>
                    <div style={{ display: 'inline', paddingLeft: '2rem' }}>
                      <Dropdown style={{ position: "absolute", display: "inline" }}>
                        <Dropdown.Toggle
                          variant="secondary"
                          id={`dropdown-${chat._id}`}
                          style={{
                            boxShadow: "none",
                            all: "unset",
                            cursor: "pointer",
                            paddingLeft: '10px',
                            paddingRight: '15px'
                          }}
                        />
                        <Dropdown.Menu
                          style={{
                            position: "absolute",
                            zIndex: 1,
                            marginTop: '0.5rem',
                            marginLeft: '5rem',
                            backgroundColor: 'white',
                            boxShadow: '0px 4px 10px #045912',
                            borderRadius: '5px',
                          }}
                        >
                          <Dropdown.Item onClick={() => handleRenameClick(chat)}>  <FaEdit style={{ marginRight: 5 }} />Rename</Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleDeleteClick(chat)}
                            style={{ color: "red" }}
                          >
                            <FaTrash style={{ marginRight: 5 }} />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </MenuItem>
                );
              })}
        </Menu>
      </Sidebar>

      {/* Rename Modal */}
      <Rename ShowReplaceModal={ShowReplaceModal}  setShowReplaceModal={setShowReplaceModal} newTitle={newTitle}
      setNewTitle={setNewTitle} handleUpdateChat={handleUpdateChat}/>

      {/* Delete Modal */}
      <Delete showDeleteModal={showDeleteModal} handleCloseModal={handleCloseModal} 
      handleConfirmDelete={handleConfirmDelete} chatToDelete={chatToDelete}/>
    </div>
  );
};

export default MySidebar;
