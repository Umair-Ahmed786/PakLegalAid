import './App.css';
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import About from './components/About';
import Navbar from './components/Navbar';

import Sidebar from './components/MySidebar';
import { ChatProvider } from "./context/chat/ChatProvider";
import { MessageProvider } from './context/message/MessageProvider';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react';
import NoChatSelected from './components/NoChatSelected';

function App() {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [CurrentChat, setCurrentChat] = useState(null);
  // Toggle sidebar collapse/expand

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      {/* <AlertProvider>
      <NoteContext> */}
      <ChatProvider>
        <MessageProvider>

          <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
              {/* Sidebar */}
              {/* <Sidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} setCurrentChat={setCurrentChat} /> */}
              <Sidebar
                toggleSidebar={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
              // setCurrentChat={setCurrentChat}
              // CurrentChat={CurrentChat}
              />

              <div style={{ flex: 1 }}>
                {/* Main Content */}
                <Navbar isSidebarCollapsed={isSidebarCollapsed} />
                <Routes>

                  <Route
                    path="/about" element={
                      <SignedIn>
                        {/* <About isSidebarCollapsed={isSidebarCollapsed} CurrentChat={CurrentChat} setCurrentChat={setCurrentChat} /> */}
                        <About isSidebarCollapsed={isSidebarCollapsed} />
                      </SignedIn>
                    }
                  />

                  <Route
                    path="/nochat" element={
                      <SignedIn>
                        <NoChatSelected isSidebarCollapsed={isSidebarCollapsed} />
                      </SignedIn>
                    }
                  />

                  {/* <Route
                    path="/" element={
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    }
                  /> */}
                  <Route
                    path="/"
                    element={
                      <>
                        <SignedOut>
                          <RedirectToSignIn />
                        </SignedOut>
                        <SignedIn>
                          <NoChatSelected isSidebarCollapsed={isSidebarCollapsed} />
                        </SignedIn>
                      </>
                    }
                  />


                </Routes>

              </div>
            </div>
          </Router>
        </MessageProvider>
      </ChatProvider>
      {/* </NoteContext>
        </AlertProvider> */}
    </>
  );
}

export default App;
