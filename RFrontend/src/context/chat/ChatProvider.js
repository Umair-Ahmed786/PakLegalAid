import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from '@clerk/clerk-react'


// Create the ChatContext
const ChatContext = createContext();

// Custom hook to use ChatContext
export const useChat = () => {
  return useContext(ChatContext);
};

// ChatProvider Component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const { getToken, isLoaded, isSignedIn } = useAuth()
  
  // const localhost = "http://localhost:3000";
  const localhost = process.env.REACT_APP_BACKEND_MONGO_CONNECTION;
 
  console.log("localhost:", localhost);

  // additonall work
  const [CurrentChat, setCurrentChat] = useState(null);

  // Fetch chats for the authenticated user
  const fetchChats = async () => {
    try {

      const mongoConnectionString = process.env.REACT_APP_BACKEND_MONGO_CONNECTION;

      console.log("mongo db Connection String: ", mongoConnectionString);

      console.log('All env vars:', process.env);

      console.log('Mongo var:', process.env.REACT_APP_BACKEND_MONGO_CONNECTION);
      const token = await getToken(); // Ensure this function returns a valid token
      console.log("My token is: ", token);

      const response = await fetch(`${localhost}/chat/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('here is am')

      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const data = await response.json(); // Parse response as JSON
      console.log('here is my data:', data)
      setChats(data); // Update state with fetched chats
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };


  // Add a new chat
  const addChat = async (chatTitle = "New Chat") => {
    try {
      const token = await getToken(); // Ensure this function returns a valid token
      if (!token) {
        throw new Error("Token is missing or invalid");
      }

      console.log("My token is: ", token);

      const response = await fetch(`${localhost}/chat/addchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: chatTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add chat");
      }

      const data = await response.json();

      // Update state with the new chat
      setChats((prevChats) => [data, ...prevChats]);
      console.log("Chat added successfully:", data);
      return data

    } catch (error) {
      console.error("Error adding chat:", error.message);
    }
  };


  // Delete a chat
  const deleteChat = async (chatId) => {
    try {

      const token = await getToken(); // Ensure this function returns a valid token
      if (!token) {
        throw new Error("Token is missing or invalid");
      }

      await axios.delete(`${localhost}/chat/deletechat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if required
        },
      });

      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };


  const updateChat = async (chatId, newTitle) => {
    try {
      const token = await getToken(); // Ensure this function returns a valid token
      if (!token) {
        throw new Error("Token is missing or invalid");
      }

      // Send PUT request to update chat title
      const response = await axios.put(
        `${localhost}/chat/update/${chatId}`,
        { title: newTitle }, // Send the new title in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if required
          },
        }
      );

      // Update the chat in the local state with the new title
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, title: response.data.title } : chat
        )
      );
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };




  return (
    <ChatContext.Provider value={{ chats, fetchChats, addChat, deleteChat, updateChat, CurrentChat, setCurrentChat }}>
      {children}
    </ChatContext.Provider>
  );
};
