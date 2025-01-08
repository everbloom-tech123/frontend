import React from 'react';
import { Home, Map, Camera, Flag, Calendar } from 'lucide-react';


const FooterNav = () => {
    return (
        <div className="border-t py-8">
            <div className="container mx-auto flex justify-center space-x-12">
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <Home size={24}/>
                    <span>Where to stay</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <Map size={24}/>
                    <span>What to eat</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <Camera size={24}/>
                    <span>What to see</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <Flag size={24}/>
                    <span>What to do</span>
                </a>
                <a href="#" className="flex flex-col items-center text-gray-600">
                    <Calendar size={24}/>
                    <span>When visit</span>
                </a>
            </div>
        </div>
    );
};

export default FooterNav;