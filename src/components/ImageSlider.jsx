import React, { useState } from 'react';
// Import the CSS in your actual component usage:
import './slider.css';

const ImageSlider = ({ images }) => {
  const [currentImages, setCurrentImages] = useState(images);
  const [isAnimating, setIsAnimating] = useState(false);

  const moveSlider = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (direction === 'next') {
      const slider = document.querySelector('.slider');
      slider.classList.add('next');
      
      setTimeout(() => {
        setCurrentImages(prev => {
          const newImages = [...prev];
          const firstItem = newImages.shift();
          newImages.push(firstItem);
          return newImages;
        });
        slider.classList.remove('next');
        setIsAnimating(false);
      }, 500);
    } else {
      const slider = document.querySelector('.slider');
      slider.classList.add('prev');
      
      setTimeout(() => {
        setCurrentImages(prev => {
          const newImages = [...prev];
          const lastItem = newImages.pop();
          newImages.unshift(lastItem);
          return newImages;
        });
        slider.classList.remove('prev');
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="slider">
      <div className="list">
        {currentImages.map((image, index) => (
          <div key={index} className="item">
            <img src={image.src} alt="" />
            <div className="content">
              <div className="title">{image.title}</div>
              <div className="type">{image.type}</div>
              <div className="description">
                {image.description}
              </div>
              <div className="button">
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnail">
        {currentImages.map((image, index) => (
          <div key={index} className="item">
            <img src={image.src} alt="" />
          </div>
        ))}
      </div>

      <div className="nextPrevArrows">
        <button className="prev" onClick={() => moveSlider('prev')}> &lt; </button>
        <button className="next" onClick={() => moveSlider('next')}> &gt; </button>
      </div>
    </div>
  );
};

export default ImageSlider;