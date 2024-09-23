import { gsap } from 'gsap';
import React, { useEffect } from 'react';

import './LoadingPage.css'; // Ensure you have this CSS file in your project

const LoadingPage = () => {
  useEffect(() => {
    gsap.fromTo(
      ".loading-page",
      { opacity: 1 },
      {
        opacity: 0,
        display: "none",
        duration: 1.5,
        delay: 3.5,
      }
    );

    gsap.fromTo(
      ".logo-name",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 0.5,
      }
    );
  }, []);

  return (
    <div className="loading-page">
        {/* Your loading icon and animation here. Note that the <i class="fa-brands fa-neos"></i> requires FontAwesome, make sure it's included if you use such icons */}
        <div className="name-container">
            <div className="logo-name">LINK EDU</div>
        </div>
    </div>
  );
};

export default LoadingPage;
