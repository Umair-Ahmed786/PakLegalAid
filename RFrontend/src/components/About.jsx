import React, { useState, useEffect, useRef } from "react";
import user from '../images/user.png';
import Spinner from 'react-bootstrap/Spinner';
import text_load from '../images/text_load.gif';
import cohere from '../images/cohere.png';
import { useMessage } from '../context/message/MessageProvider';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import { useChat } from "../context/chat/ChatProvider";
import NoChatSelected from "./NoChatSelected";
import PLAlogo from '../images/PLAlogo.png';
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router";

const About = ({ isSidebarCollapsed }) => {
  const { addMessage, loading, messages, setMessages, getMessage } = useMessage();
  const [inputValue, setInputValue] = useState("");
  const [load, setLoad] = useState(false);
  const { chats, CurrentChat, setCurrentChat } = useChat();
  const CurrentChatID = CurrentChat ? CurrentChat._id : '';
  let navigate = useNavigate();
  

  // Create a ref for the messages container
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom when a new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nonLegalResponses = [
    "🚫 Please ask a legal query.",
    "⚠️ This doesn't seem like a legal question. Try again with a law-related issue.",
    "❌ Sorry, I only assist with Pakistani legal matters.",
    "📚 Kindly ask something related to family, criminal, or property law.",
    "🚫 This appears to be outside the scope of legal advice."
  ];

  const randomIndex = Math.floor(Math.random() * nonLegalResponses.length);
  const randomNonLegalResponse = nonLegalResponses[randomIndex];

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    try {
      setLoad(true);
      const chatId = CurrentChat._id;
      const userMessage = { sender: "user", content: inputValue };

      // Step 1: Show user message immediately (local only)
      setMessages((prev) => [...prev, userMessage]);

      // Step 2: Call FastAPI RAG endpoint
      console.log("calling fast api");
      // const fastApiResponse = await fetch("https://bf7d-121-52-154-85.ngrok-free.app/query", {
      const FASTAPIConnectionString = process.env.REACT_APP_FASTAPI_CONNECTION;
      console.log("fast api connection String: ", FASTAPIConnectionString)

      const fastApiResponse = await fetch(`${FASTAPIConnectionString}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputValue }),
      });

      const data = await fastApiResponse.json();
      const modelAnswer = data.response?.answer;
      console.log("response from fast api", modelAnswer);

      // Step 3: If Non-Legal
      if (modelAnswer === "Non-Legal" || undefined) {
        const nonLegalResponse = {
          sender: "assistant",
          content: randomNonLegalResponse,
        };

        setMessages((prev) => [...prev, nonLegalResponse]);
        setInputValue("");
        setLoad(false);
        return;
      }
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // removes the last message
        return updated;
      });

      // Step 4: If legal, persist both user and assistant messages
      await addMessage(chatId, "user", inputValue);
      await addMessage(chatId, "assistant", modelAnswer);

      setInputValue(""); // clear input
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setLoad(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (CurrentChat && CurrentChat._id) {
      setMessages('');
      getMessage(CurrentChatID);
    }
  }, [CurrentChatID]);

  // Scroll to the bottom every time the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!CurrentChat) {
    // return <NoChatSelected setCurrentChat={setCurrentChat} />;
    // Navigate('nochat')
    navigate('/nochat');
  }

  return (
    <>
      <div className="container" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <div className="row" style={{ display: "flex", justifyContent: 'flex-end', marginLeft: isSidebarCollapsed ? '0' : '2rem' }}>
          <div className="col col-lg-11 col-md-9 col-sm-9">
            <div className="row" style={{ backgroundColor: 'white', marginBottom: '4rem' }}>
              <div className="response mt-2 mb-4 px-4" style={{ backgroundColor: 'white' }}>

                {messages && messages.length > 0 ? (
                  <h4 className='pb-4' style={{ paddingTop: '5rem', color: '#045912' }}>
                    Your Responses:
                  </h4>
                ) : (
                  <div
                    className="container"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                      marginTop: '0'
                    }}
                  >
                    <h2
                      className='pb-4'
                      style={{
                        color: '#045912',
                        textAlign: 'center',
                        // border: '2px solid black', 
                        padding: '1rem',
                        width: '100%',
                        maxWidth: '600px'
                      }}
                    >
                      <img
                        src={PLAlogo}
                        alt="PakLegalAid Logo"
                        style={{
                          height: '60px',
                          width: 'auto',
                          marginRight: '3%',
                          // border: '2px solid #045912',
                          filter: 'invert(1) hue-rotate(180deg)',  // This inverts the colors and rotates hues
                        }} />
                      I can help you with Criminal, Property and Family law
                    </h2>
                  </div>
                )}


                {/* <h4 className='pb-4' style={{ paddingTop: '5rem', color: '#045912' }}>
                  Your Responses:
                </h4> */}

                {messages && messages.map((message, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem',
                    paddingTop: '2rem'
                  }}>
                    <div style={{
                      maxWidth: message.sender === 'assistant' ? '95%' : '60%',
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: message.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                      textAlign: 'justify',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={message.sender === 'user' ? user : cohere} alt={message.sender === 'user' ? 'user' : 'cohere'} style={{ height: '2rem', marginRight: '0.5rem' }} />
                      </div>
                      <div style={{ textAlign: 'justify' }}>
                        {message.sender === 'assistant' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>  // Render markdown content
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {load && (
                  <div style={{ marginBottom: '5rem' }}>
                    <p>
                      <b>
                        <img src={cohere} alt="cohere" style={{ height: '2rem' }} /> AI:
                      </b>
                      <div style={{ paddingLeft: '2.2rem', textAlign: 'justify' }}>
                        <Spinner animation="grow" />
                      </div>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* <button
              onClick={scrollToBottom}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: isSidebarCollapsed ? '20px' : '280px', // adjust based on sidebar
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                zIndex: 1000
              }}
            >
              ⬇️
            </button> */}


            {/* Input field */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              // bottom: '2rem',
              bottom: messages && messages.length > 0 ? '2%' : '40%',
              width: '70%',
              marginLeft: '5rem',
              boxSizing: 'border-box',
            }}>
              <TextareaAutosize
                disabled={load}
                type="text"
                placeholder='Prompt here: '
                value={inputValue}
                minRows={1.4}
                maxRows={7}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  width: '100%',
                  borderRadius: '10px 0 0 10px',
                  border: '1px solid #ced4da',
                  boxShadow: '0 0 0 1px #ced4da, 0 0 0 3px transparent',
                  padding: "8px",
                  fontSize: '1.2rem',
                }}
              />

              <button
                onClick={handleSubmit}
                disabled={load}
                className="btn btn-md"
                style={{
                  backgroundColor: '#045912',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0 10px 10px 0',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {load ? "..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default About;
