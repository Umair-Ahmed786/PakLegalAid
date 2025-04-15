import React, { useState, useEffect, useRef } from "react";
import MySidebar from "./MySidebar";
import user from '../images/user.png'
import Spinner from 'react-bootstrap/Spinner';

import text_load from '../images/text_load.gif'
import cohere from '../images/cohere.png'

import { useMessage } from '../context/message/MessageProvider'
import { GoogleGenerativeAI } from "@google/generative-ai";
import TextareaAutosize from 'react-textarea-autosize';





const About = ({ isSidebarCollapsed, CurrentChat }) => {

  const { addMessage, loading, messages, setMessages, getMessage } = useMessage(); // Access addMessage and loading
  const [inputValue, setInputValue] = useState("");
  const [load, setload] = useState(false);
  const CurrentChatID = CurrentChat ? CurrentChat._id : ''

  const editableDivRef = useRef(null);



  // Handler for submitting the message
  const handleSubmit = async () => {
    if (!inputValue.trim()) return; // Avoid empty messages

    try {
      setload(true)
      // Replace 'chatId' and 'sender' with appropriate values
      const chatId = CurrentChat._id;
      console.log("This is Current Chat ", CurrentChat)
      const sender = "user";

      await addMessage(chatId, sender, inputValue);

      //for gemini's response 
      console.log("REached Gemini part")
      // const genAI = new GoogleGenerativeAI('AIzaSyD-edDjXingTU2SjjgrwPHnEEPVO96_e5U');
      const genAI = new GoogleGenerativeAI('AIzaSyCIkvHTGhhFxTvwbp3mXHWXBGIlEYLJWlg');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(inputValue);
      const generatedAnswer = result.response.text()
      console.log('Generated Answer from Gemini is: ', generatedAnswer);

      await addMessage(chatId, 'assistant', generatedAnswer);

      //End of Gemini
      setload(false);
      setInputValue(""); // Clear the input field after submission

    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      handleSubmit(); // Call handleSubmit
    }
  };

  useEffect(() => {
    if (CurrentChat && CurrentChat._id) {
      setMessages('');
      console.log('current chat id is: ', CurrentChat._id);
      getMessage(CurrentChatID);
    }
  }, [CurrentChatID]);



  return (
    <>
      <div
        className="container"
        style={{
          // width: '100%',
          // border: '2px solid black',
          // backgroundColor: 'honeydew',
          // zIndex: -1
        }}
      >
        <div className="row" style={{ 
          // border: '2px solid yellow',
           display: "flex", justifyContent: 'flex-end', marginLeft: isSidebarCollapsed ? '0' : '2rem' }}>

          <div className="col col-lg-11 col-md-9 col-sm-9" >
            {/* This is About: Umair Ahmed. I am studying in BS. */}

            <div className="row" style={{
              //  border: '2px solid black',
               backgroundColor: 'honeydew',
                marginBottom: '4rem' }}>

              <div
                className="response mt-2 mb-4 px-4"
                style={{
                  // backgroundColor: 'honeydew',
                  // border: '2px solid black',
                }}
              >
                <h4 className='pb-4' style={{ paddingTop: '5rem' }}>Your Responses:</h4>
                {

                  messages && messages.map((message, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '1rem',
                        // margintop: '2rem'
                        paddingTop: '2rem'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: message.sender === 'assistant' ? '95%' : '60%',
                          padding: '1rem',
                          borderRadius: '10px',
                          backgroundColor: message.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                          textAlign: 'justify',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={message.sender === 'user' ? user : cohere}
                            alt={message.sender === 'user' ? 'user' : 'cohere'}
                            style={{ height: '2rem', marginRight: '0.5rem' }}
                          />
                          {/* <b>{message.sender === 'user' ? 'You:' : 'AI:'}</b> */}
                        </div>
                        <div style={{ textAlign: 'justify' }}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))


                }

                <div>

                  {/* {loading && <img src={text_load} style={{ width: '20rem', marginBottom: '5rem', width: '5rem' }} alt="loading" />} */}

                  {load &&
                   <div>
                    {/* <p style={{ textAlign: 'justify' }}> <img src={user} alt="cohere" style={{ height: '2rem' }} /> <b>You:</b> <div style={{ paddingLeft: '2.3rem', textAlign: 'justify' }}> <p></p>{inputValue}</div></p> */}
                    {<p style={{ marginBottom: '5rem' }}> <b><img src={cohere} alt="cohere" style={{ height: '2rem' }} />AI:</b> <div style={{ paddingLeft: '2.2rem', textAlign: 'justify' }}>
                      {/* <img src={text_load} style={{ width: '20rem', marginBottom: '5rem', width: '5rem' }} alt="loading" /> */}
                      <Spinner animation="grow" />;
                      </div> </p>}
                  </div>}

                </div>


              </div>
            </div>

            {/* input field */}
            <div
              className=""
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'fixed',
                bottom: '1rem',
                // top: '1rem',
                width: '70%',
                marginLeft: '5rem',
                // border: '2px solid black',

                boxSizing: 'border-box',
                margintop: '50em',
              }}
            >
              <TextareaAutosize

                disabled={load}
                type="text"
                placeholder='Promt here: '
                value={inputValue}
                minRows={1.4}
                maxRows={7}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  width: '100%',
                  borderRadius: '10px 0 0 10px ',
                  border: '1px solid #ced4da', // Add a default border
                  boxShadow: '0 0 0 1px #ced4da, 0 0 0 3px transparent',
                  padding: "8px",
                  fontSize: '1.2rem'
                }}

              />


              {/* submit button */}

              <button
                onClick={handleSubmit}
                disabled={load}
                className="btn btn-md btn-primary"

                style={{
                  // color: '#fff',
                  // border: 'none',
                  borderRadius: '0 10px 10px 0',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {load ? "..." : "Submit"}
              </button>

              {/* button ended  */}

            </div>
            {/* input field ended */}



          </div>
        </div>
      </div>
    </>
  );
};

export default About;
