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

function App() {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [CurrentChat, setCurrentChat] = useState('');
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
          <Sidebar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} setCurrentChat={setCurrentChat} />

          <div style={{ flex: 1 }}>
            {/* Main Content */}
            <Navbar isSidebarCollapsed={isSidebarCollapsed}/>
            <Routes>
              <Route
                path="/about" element={
                  <SignedIn>
                    <About isSidebarCollapsed={isSidebarCollapsed} CurrentChat={CurrentChat} />
                  </SignedIn>
                }
              />
              <Route
                path="/" element={
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
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



// import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
// import React, { useEffect } from 'react';

// export default function App() {
//   const { getToken, isLoaded, isSignedIn } = useAuth();

//   useEffect(() => {
//     const fetchToken = async () => {
//       if (isLoaded && isSignedIn) {
//         const token = await getToken();
//         console.log('User Token:', token);
//       }
//     };

//     fetchToken();
//   }, [isLoaded, isSignedIn, getToken]); // Ensure getToken is part of the dependency array

//   return (
//     <header>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </header>
//   );
// }
