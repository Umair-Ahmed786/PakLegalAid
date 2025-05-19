import { UserButton } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PLAlogo from '../images/PLAlogo.png';

const Navbar = ({ isSidebarCollapsed }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  let location = useLocation();

  const HandleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Adjust font size based on the window width
  const getFontSize = () => {
    if (windowWidth <= 576) {
      return '0.8rem';
    } else if (windowWidth <= 768) {
      return '0.9rem';
    } else if (windowWidth <= 992) {
      return '1rem';
    } else if (windowWidth <= 1200) {
      return '1.1rem';
    } else {
      return '1.2rem';
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: '#045912',
        marginLeft: isSidebarCollapsed ? '5rem' : '15.6rem',
        position: 'fixed',
        width: isSidebarCollapsed ? '94.8%' : '83.5%',
        zIndex: 1000,
      }}
    >
      <div className="container-fluid">
        <img
          src={PLAlogo}
          alt="PakLegalAid Logo"
          style={{
            height: '40px',
            marginRight: '8px',
          }}
        />
        <span
          style={{
            fontWeight: 'bold',
            fontSize: getFontSize(),
            color: 'white',
          }}
        >
          PakLegalAid AI
        </span>

        <li>
          <UserButton />
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
