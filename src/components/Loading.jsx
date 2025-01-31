import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../animation/LoadingAnimation.json';

const LoadingScreen = ({ size , minDuration = 1000, maxDuration = 4000, backgroundColor = "#101010"}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate random duration between 1 and 5 seconds
    const duration = Math.floor(Math.random() * maxDuration) + minDuration;

    // Set timer to hide animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: backgroundColor, // You can change the background color
    zIndex: 9999
  };

  if (!isLoading) return null;

  return (
    <div style={containerStyle}>
      <Lottie
        options={defaultOptions}
        height={size || 200}
        width={size || 200}
      />
    </div>
  );
};

export default LoadingScreen;