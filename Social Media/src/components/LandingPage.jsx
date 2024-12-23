
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons'; 
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; 


import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';

const LandingPage = () => {

  const nav=useNavigate();

  const Navigate=()=>{
    nav('/register')
  }
  return (
  <div className='landingpage'>
      <div className="collage-container">
       
        <div className="image-grid">
          <img src="/images/image1.jpg" alt="image 1" />
          <img src="/images/image2.jpg"alt="image 2" />
          <img src="/images/image3.jpg" alt="image 3" />
          <img src="/images/image4.jpg" alt="image 4" />
          <img src="/images/image5.jpg" alt="image 5" />
          <img src="/images/image6.jpg" alt="image 6" />
          <img src="/images/image7.jpg" alt="image 7" />
          <img src="/images/image8.jpg" alt="image 8" />
          <img src="/images/image9.jpg" alt="image 9" />
        </div>

     
        <div className="content-center">
        
          <h1> <FontAwesomeIcon icon={faCamera} size="1x" style={{ color: 'black', marginBottom: '2px' }} />Vibesnap</h1>
       
          <p>Moments That Matter, Shared Forever.</p>
          
          {/* Google Button */}
          <button className="google-button" onClick={Navigate}>
            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '10px', color: 'white' }}  />
            Continue with Google/Register
          </button>
        </div>
      </div>
      </div>
  );
};

export default LandingPage;

