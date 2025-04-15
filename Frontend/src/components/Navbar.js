import { UserButton } from '@clerk/clerk-react';
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();

  let location = useLocation();
  const HandleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login')
  };


  return (

    // <nav className="navbar navbar-expand-lg navbar-dark bg-dark " style={{marginLeft: isSidebarCollapsed ?'4rem': '14rem'}}>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark " style={{
      marginLeft: isSidebarCollapsed ?'5rem': '15.6rem',
      position: 'fixed', // Fix the navbar at the top
      width: isSidebarCollapsed ?'94.8%': '83.5%',
      zIndex: 1000, // Ensure it stays above other content

    }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">PakLegalAid</Link>

        <li >
            <UserButton/>
        </li>

      </div>
    </nav>
  )
}

export default Navbar
