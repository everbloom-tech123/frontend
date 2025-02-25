import React, { useState } from 'react';
import { X } from 'lucide-react';

const ImageGrid = ({ images = [
    { id: 1, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644110558_2/kayak-selfie-krystle-wright', alt: 'Survey 1' },
    { id: 2, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644124190_6/veso-ovcharov-selfie-skydive', alt: 'Survey 2' },
    { id: 3, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/29/1331648071122_2/jokke-sommer-hawaii-heli-selfie', alt: 'Survey 3' },
    { id: 4, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644125208_8/gavin-mcclurg-gopro-speed-rider', alt: 'Survey 4' },
    { id: 5, src: 'https://media.gadventures.com/media-server/cache/7d/84/7d8496da5755285ae372efb3b413f545.jpg', alt: 'Survey 5' },
    { id: 6, src: 'https://as1.ftcdn.net/jpg/01/80/86/96/1000_F_180869663_oVEvO9XmUVwnxzWkM45fN8zQXZ83jWBN.jpg', alt: 'Survey 6' },
    { id: 7, src: 'https://st2.depositphotos.com/1017986/6014/i/600/depositphotos_60142053-stock-photo-friends-with-smartphone-taking-selfie.jpg', alt: 'Survey 7' },
    { id: 8, src: 'https://powertraveller.com/wp-content/uploads/2024/08/1_treeking-to-knuckles-adventure-camping-in-meemure.jpg', alt: 'Survey 8' },
    { id: 9, src: 'https://powertraveller.com/wp-content/uploads/2024/08/3_treeking-to-knuckles-adventure-camping-in-meemure.jpg', alt: 'Survey 9' },
    { id: 10, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644110558_2/kayak-selfie-krystle-wright', alt: 'Survey 1' },
    { id: 11, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644124190_6/veso-ovcharov-selfie-skydive', alt: 'Survey 2' },
    { id: 12, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/29/1331648071122_2/jokke-sommer-hawaii-heli-selfie', alt: 'Survey 3' },

] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="mx-auto">
        <div className="mb-8">
          <div className="inline-block relative">
              <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                  Gallery
              </h1>

          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          {images.map((image) => (
            <div 
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
              <div
                className="relative max-w-2xl w-full bg-transparent transform transition-all duration-300 ease-out animate-modalEntry"
                onClick={e => e.stopPropagation()}
              >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add this to your global CSS
const styles = `
  @keyframes modalEntry {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-modalEntry {
    animation: modalEntry 0.2s ease-out forwards;
  }
`;

export default ImageGrid;