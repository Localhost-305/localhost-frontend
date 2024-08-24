import React from "react";
import { Spin } from "antd";

const FirstScreen: React.FC = () => {

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000
  };

  const spinStyle = {
    fontSize: '40px'
  };

  return (
    <div style={containerStyle}>
      <Spin size="large" style={spinStyle} />
    </div>
  );
};

export default FirstScreen;