import React from 'react'
import logo from '../../assets/images/logo4.png'

const Dashboard = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '88vh',
      width: '100%'
    }}>
      <img 
        src={logo} 
        alt="Logo" 
        style={{ 
          maxWidth: 'auto',
          display: 'block' 
        }} 
      />
    </div>
  )
}

export default Dashboard