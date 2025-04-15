import React, { useContext } from 'react';
import { AlertContext } from '../context/alert/AlertContext';

const Alert = () => {
  const { alert } = useContext(AlertContext);

  return (
    alert && (
      <div className={`alert alert-${alert.type} px-5`} role="alert">
       <b> {alert.type === 'danger'? `ERROR: ${alert.message}`: `${alert.type.toUpperCase()}: ${alert.message}` }</b>
      </div>
    )
  );
  // ${alert.type.toUpperCase()}: ${alert.message}`
};

export default Alert;
