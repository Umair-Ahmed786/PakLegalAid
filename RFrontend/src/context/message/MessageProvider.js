import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react'


// Create the context
const MessageContext = createContext();

// Custom hook to use the ChatContext
export const useMessage = () => useContext(MessageContext);

// ChatProvider component
export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getToken, isLoaded, isSignedIn } = useAuth()

    // const localhost = "http://localhost:3000";
    
    const localhost = process.env.REACT_APP_BACKEND_MONGO_CONNECTION;

    console.log("localhost:", localhost);




    // Function to add a message
    const addMessage = async (chatId, sender, content) => {
        try {
            const token = await getToken(); // Ensure this function returns a valid token
            if (!token) {
                throw new Error("Token is missing or invalid");
            }

            console.log("My token is: ", token);

            setLoading(true);



            // Make a POST request to the backend
            const response = await fetch(`${localhost}/message/addmessage/${chatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sender, content }),
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Failed to add message: ${response.statusText}`);
            }

            // Parse the response JSON
            const newMessage = await response.json();
            console.log("New message from server:", newMessage);

            // Update the local state with the new message
            setMessages((prevMessages) => {
                if (!Array.isArray(prevMessages)) {
                    console.error("prevMessages is not an array:", prevMessages);
                    return [newMessage];
                }
                return [...prevMessages, newMessage];
            });
        } catch (error) {
            console.error("Error adding message:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMessage = async (chatId) => {
        try {
            const token = await getToken(); // Ensure this function returns a valid token
            if (!token) {
                throw new Error("Token is missing or invalid");
            }

            console.log("in the get message method My token is: ", token);
            const mongoConnectionString = process.env.REACT_APP_BACKEND_MONGO_CONNECTION;

            console.log("mongo db url: ", mongoConnectionString);

            setLoading(true);

            // Make a POST request to the backend

            const response = await fetch(`${localhost}/message/getmessage/${chatId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Failed to add message: ${response.statusText}`);
            }

            // Parse the response JSON
            const fetchedMessages = await response.json();
            console.log("Fetched messages from server:", fetchedMessages);

            // Update the local state with the fetched messages
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error adding message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MessageContext.Provider value={{ messages, addMessage, loading, setMessages, getMessage }}>
            {children}
        </MessageContext.Provider>
    );
};
