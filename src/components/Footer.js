import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Navigation } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://www.holidify.com/images/cmsuploads/compressed/nightclub-3492748_1280_20200109143658.jpg')"
    }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Ceylon Bucket</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the beauty of Sri Lanka with Ceylon Bucket. We provide authentic travel experiences
              and unforgettable adventures across the paradise island.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Destinations</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Sigiriya', desc: 'Ancient Rock Fortress' },
                { name: 'Ella', desc: 'Mountain Paradise' },
                { name: 'Mirissa', desc: 'Beach & Whales' },
                { name: 'Kandy', desc: 'Cultural Capital' },
                { name: 'Yala', desc: 'Wildlife Safari' },
                { name: 'Galle', desc: 'Historic Fort' }
              ].map((dest) => (
                <Link
                  key={dest.name}
                  to={`/destination/${dest.name.toLowerCase()}`}
                  className="group"
                >
                  <div className="text-gray-300 hover:text-white transition-colors">
                    <div className="font-medium">{dest.name}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-200">{dest.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={18} />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={18} />
                <span>info@ceylonbucket.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={18} />
                <span>123 Temple Road, Colombo 07, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to our newsletter for travel updates and exclusive offers.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button className="w-full bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Ceylon Bucket. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;