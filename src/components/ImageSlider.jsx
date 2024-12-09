import React, { useState, useEffect } from 'react';

// Styles object for dynamic inline styles
const styles = {
  slider: `
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    margin-top: -50px;
  `,
  list: `
    width: 100%;
    height: 100%;
    position: relative;
  `,
  item: `
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0 0 0 0;
  `,
  image: `
    width: 100%;
    height: 100%;
    object-fit: cover;
  `,
  content: `
    position: absolute;
    top: 20%;
    width: 1140px;
    max-width: 80%;
    left: 50%;
    transform: translateX(-50%);
    padding-right: 30%;
    box-sizing: border-box;
    color: #fff;
    text-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  `,
  title: `
    font-size: 5em;
    font-weight: bold;
    line-height: 1.3em;
  `,
  type: `
    font-size: 5em;
    font-weight: bold;
    line-height: 1.3em;
    color: #14ff72cb;
  `,
  button: `
    display: grid;
    grid-template-columns: repeat(2, 130px);
    grid-template-rows: 40px;
    gap: 5px;
    margin-top: 20px;
  `,
  seeMoreBtn: `
    border: none;
    background-color: #eee;
    font-family: Poppins;
    font-weight: 500;
    cursor: pointer;
    transition: 0.4s;
    letter-spacing: 2px;
    &:hover {
      letter-spacing: 3px;
    }
  `,
  thumbnail: `
    position: absolute;
    bottom: 50px;
    left: 50%;
    width: max-content;
    z-index: 100;
    display: flex;
    gap: 20px;
  `,
  thumbnailItem: `
    width: 150px;
    height: 220px;
    flex-shrink: 0;
    position: relative;
  `,
  thumbnailImage: `
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
  `,
  arrows: `
    position: absolute;
    top: 80%;
    right: 52%;
    z-index: 100;
    width: 300px;
    max-width: 30%;
    display: flex;
    gap: 10px;
    align-items: center;
  `,
  arrowButton: `
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #14ff72cb;
    border: none;
    color: #fff;
    font-family: monospace;
    font-weight: bold;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      background-color: #fff;
      color: #000;
    }
  `,
};

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    // Add Poppins font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const moveSlider = (newDirection) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(newDirection);

    const nextIndex = newDirection === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
      setDirection(null);
    }, 500);
  };

  return (
    <div 
      className={`slider ${direction || ''}`}
      css={styles.slider}
    >
      <div className="list" css={styles.list}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`item ${index === currentIndex ? 'active' : ''}`}
            css={[
              styles.item,
              index === currentIndex && {
                zIndex: 1,
                '.content > *': {
                  animation: 'showContent 0.5s linear forwards',
                },
              },
            ]}
          >
            <img src={image.src} alt={image.type} css={styles.image} />
            <div className="content" css={styles.content}>
              <div className="title" css={styles.title}>{image.title}</div>
              <div className="type" css={styles.type}>{image.type}</div>
              <div className="description">{image.description}</div>
              <div className="button" css={styles.button}>
                <button css={styles.seeMoreBtn}>SEE MORE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnail" css={styles.thumbnail}>
        {images.map((image, index) => (
          <div key={index} className="item" css={styles.thumbnailItem}>
            <img src={image.src} alt={image.type} css={styles.thumbnailImage} />
          </div>
        ))}
      </div>

      <div className="nextPrevArrows" css={styles.arrows}>
        <button 
          className="prev" 
          onClick={() => moveSlider('prev')} 
          css={styles.arrowButton}
          disabled={isAnimating}
        >
          &lt;
        </button>
        <button 
          className="next" 
          onClick={() => moveSlider('next')} 
          css={styles.arrowButton}
          disabled={isAnimating}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

// Example usage
const sampleImages = [
  {
    src: 'public/Images/beach.jpg',
    title: 'MAGIC SLIDER',
    type: 'FLOWER',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio.'
  },
  {
    src: 'public/Images/club.png',
    title: 'MAGIC SLIDER',
    type: 'NATURE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio.'
  },
  {
    src: 'public/Images/Sigiriya.jpg',
    title: 'MAGIC SLIDER',
    type: 'PLANT',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio.'
  },
  {
    src: 'public/Images/yatch.jpg',
    title: 'MAGIC SLIDER',
    type: 'NATURE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti temporibus quis eum consequuntur voluptate quae doloribus distinctio.'
  }
];

export default ImageSlider;