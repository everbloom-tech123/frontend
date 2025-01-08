import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = ({ images = [
    { id: 1, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644110558_2/kayak-selfie-krystle-wright', alt: 'Survey 1' },
    { id: 2, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644124190_6/veso-ovcharov-selfie-skydive', alt: 'Survey 2' },
    { id: 3, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/29/1331648071122_2/jokke-sommer-hawaii-heli-selfie', alt: 'Survey 3' },
    { id: 4, src: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2014/04/07/1331644125208_8/gavin-mcclurg-gopro-speed-rider', alt: 'Survey 4' },
    { id: 5, src: 'https://media.gadventures.com/media-server/cache/7d/84/7d8496da5755285ae372efb3b413f545.jpg', alt: 'Survey 5' },
    { id: 6, src: 'https://as1.ftcdn.net/jpg/01/80/86/96/1000_F_180869663_oVEvO9XmUVwnxzWkM45fN8zQXZ83jWBN.jpg', alt: 'Survey 6' },
    { id: 7, src: 'https://st2.depositphotos.com/1017986/6014/i/600/depositphotos_60142053-stock-photo-friends-with-smartphone-taking-selfie.jpg', alt: 'Survey 7' },
    { id: 8, src: 'https://powertraveller.com/wp-content/uploads/2024/08/1_treeking-to-knuckles-adventure-camping-in-meemure.jpg', alt: 'Survey 8' },
] }  ) => {
    const [selectedImage, setSelectedImage] = useState(null);

  // Image Gallery
  const ImageGallery = () => (
      <section className="pt-5 pb-10">
          <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">Gallery<span className="text-red-200 mx-2">:</span></h2>
                  <p className="text-sm font-semibold max-w-xl text-gray-500 leading-snug hover:text-black-600 transition-colors duration-300">The
                  top experiences that have captured the interest of the most visitors, offering exceptional popularity
                  and appeal.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
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
                              <div
                                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );

    return (
        <div>
            <ImageGallery/>
        </div>
    );
};
export default Gallery;