import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useChat } from "../context/chat/ChatProvider";
import Dropdown from 'react-bootstrap/Dropdown';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useMessage } from "../context/message/MessageProvider";
import { useNavigate } from "react-router-dom";

const MySidebar = ({ toggleSidebar, isSidebarCollapsed, setCurrentChat, CurrentChat }) => {
  const { chats, fetchChats, deleteChat, addChat, updateChat } = useChat();
  // const { loading, messages, setMessages, getMessage } = useMessage();

  //For Modal
  const [ShowReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  //for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  //ended delete modal
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
  //Rename modal's functions ended


  //Delte Modal methods Started
  const handleDeleteClick = (chat) => {
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  //on Delte modal Closing
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete._id);
      handleCloseModal();
    }
  };






  useEffect(() => {
    fetchChats(); // Fetch chats when the component mounts
  }, []);


  return (
    <div
      className="container-fluid mx-auto"
      style={{
        display: "flex", height: isSidebarCollapsed ? "8.5vh" : '100vh', width: "2em",
        position: 'fixed',
        zIndex: 1,
        marginLeft: '0',
        padding: '0'
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

          {!isSidebarCollapsed && <MenuItem onClick={() => addChat()} style={{ textAlign: 'center' }}>New Chat</MenuItem>}

          {
            !isSidebarCollapsed &&
            chats
              .slice() // Create a shallow copy of the chats array
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
              .map((chat) => (

                <MenuItem key={chat._id} style={{ textAlign: 'center', }} onClick={() => {
                  setCurrentChat(chat);
                  navigate('/about');
                }}>
                  {/* <div style={{ border: '2px solid red', display: 'inline' }}> */}
                  {/* style={{display: 'flex', justifyContent: 'space-between'}} */}



                  <div style={{ display: 'inline' }} >

                    {chat.title}
                  </div>
                  {/* </div> */}



                  <div style={{ display: 'inline', paddingLeft: '2rem' }}>

                    <Dropdown style={{
                      // border: "2px solid yellow",
                      position: "absolute",
                      display: "inline",
                    }}>

                      <Dropdown.Toggle
                        variant="secondary"
                        id={`dropdown-${chat._id}`}
                        style={{

                          boxShadow: "none",
                          all: "unset", // Reset all button styles
                          cursor: "pointer", // Add pointer cursor for interactivity
                          paddingleft: '10px',
                          paddingRight: '15px'
                          // zIndex: 1
                        }}
                      >
                        {/* ⋮ */}
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        style={{

                          position: "absolute",
                          zIndex: 1,
                          // border: '2px solid yellow', // Ensure it overlays properly
                          marginTop: '0.5rem', // Adjust the dropdown position
                          marginLeft: '5rem', // Adjust for proper spacing
                          backgroundColor: 'white', // Ensure visibility
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow for separation
                          borderRadius: '5px', // Optional, for rounded corners
                        }}
                      >
                        <Dropdown.Item onClick={() => handleRenameClick(chat)}>Rename</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            handleDeleteClick(chat)
                          }

                          }
                          style={{ color: "red" }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div >
                </MenuItem>
              ))
          }

        </Menu>
      </Sidebar>

      {/* Modal started */}
      {/* Rename Modal */}
      <Modal show={ShowReplaceModal} onHide={() => setShowReplaceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="chatTitle" className="form-label">
                New Title
              </label>
              <input
                type="text"
                className="form-control"
                id="chatTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                minLength={3}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplaceModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateChat}
            disabled={!newTitle.trim()}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delet Modal Started */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Chat?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            Are you sure you want to Delete <span style={{ color: 'red' }}>{chatToDelete ? chatToDelete.title + " " : 'Delete '}</span>
            Chat? </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default MySidebar;
