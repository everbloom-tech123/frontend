import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const ModernHero = () => {
    // Array of image sources
    const images = [
        "https://images.pexels.com/photos/14925309/pexels-photo-14925309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",  // Replace with actual image URLs
        "https://images.pexels.com/photos/11267363/pexels-photo-11267363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Image rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative mx-auto overflow-visible bg-white px-6 pt-6 pb-4">
            <div className="relative mb-16">
                {/* Background Image Container with transition */}
                <div className="relative h-[500px] w-full overflow-visible rounded-[2rem]">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Adventure ${index + 1}`}
                            className={`absolute h-full w-full rounded-[2rem] object-cover transition-opacity duration-1000
                ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 rounded-[2rem] bg-black/20">
                        {/* Hero Text */}
                        <div className="flex h-full flex-col items-start justify-center p-10">
                            <div className="max-w-xl space-y-4 animate-[fadeIn_1s_ease-out]">
                                <h1 className="text-7xl font-bold leading-tight text-white md:text-7xl animate-[slideDown_0.8s_ease-out]">
                                    Life Is Adventure
                                    <br />
                                    Make The Best Of It
                                </h1>
                                <p className="text-base text-white/90 md:text-lg animate-[slideUp_0.8s_ease-out]">
                                    Planning for a trip? we will organize your best trip with the best destination and
                                    within the best budgets!
                                </p>
                            </div>
                        </div>

                        {/* Image Indicators */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-2 w-2 rounded-full transition-all duration-300
                    ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Vertical 3D Image Card */}
                        <div className="absolute right-10 top-10 w-64 animate-[fadeIn_1s_ease-out_0.3s] transform-gpu">
                            <div
                                className="group overflow-hidden rounded-[1.2rem] bg-black/5 backdrop-blur-sm p-6 shadow-[8px_8px_24px_rgb(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[12px_12px_32px_rgb(0,0,0,0.25)]"
                                style={{
                                    transform: 'perspective(1000px) rotateX(5deg)',
                                }}
                            >
                                <div className="relative text-white">
                                    <div className="text-4xl font-bold mb-2 opacity-20">"</div>
                                    <p className="text-lg font-semibold mb-4 leading-snug">
                                        Adventure is worthwhile in itself
                                    </p>
                                    <div className="flex items-center space-x-2 text-sm mb-4">
                                        <div className="h-[1px] w-8 bg-white/40"></div>
                                        <span className="text-white/90 italic">Amelia Earhart</span>
                                    </div>

                                    {/* Social Media Icons */}
                                    <div className="flex items-center justify-start space-x-4 pt-2 border-t border-white/20">
                                        <a href="#" className="text-white hover:text-white/80 transition-colors">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="text-white hover:text-white/80 transition-colors">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="text-white hover:text-white/80 transition-colors">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="text-white hover:text-white/80 transition-colors">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </a>
                                    </div>
                                    <div className="absolute -bottom-4 -right-2 text-4xl font-bold opacity-20">"</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Card */}
                    <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-6 animate-[floatUp_1s_ease-out]">
                        <div className="group rounded-2xl bg-gray-900/95 p-8 shadow-[0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center space-x-6">
                                <Search className="h-6 w-6 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                                <input
                                    type="text"
                                    placeholder="Where would you like to go?"
                                    className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes floatUp {
          from { transform: translate(-50%, calc(50% + 20px)); opacity: 0; }
          to { transform: translate(-50%, 50%); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default ModernHero;