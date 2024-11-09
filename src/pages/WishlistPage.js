// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaHeart, FaTrash } from 'react-icons/fa';
// import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext';

// const WishlistPage = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!isAuthenticated) {
//         setError('Please log in to view your wishlist.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get('/api/wishlist', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
//         });
//         setWishlistItems(response.data);
//       } catch (err) {
//         console.error('Error fetching wishlist:', err);
//         setError('Failed to fetch wishlist. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [isAuthenticated]);

//   const removeFromWishlist = async (experienceId) => {
//     try {
//       await axios.delete(`/api/wishlist/${experienceId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
//       });
//       setWishlistItems(wishlistItems.filter(item => item.id !== experienceId));
//     } catch (error) {
//       console.error('Error removing item from wishlist:', error);
//       setError('Failed to remove item from wishlist. Please try again.');
//     }
//   };

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
//       {wishlistItems.length === 0 ? (
//         <p className="text-gray-600">Your wishlist is empty. Start adding experiences you love!</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {wishlistItems.map((item) => (
//             <motion.div
//               key={item.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//               whileHover={{ scale: 1.03 }}
//               transition={{ duration: 0.3 }}
//             >
//               <img
//                 src={`/public/api/products/files/${item.firstImageUrl}`}
//                 alt={item.title}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
//                 <p className="text-gray-600 mb-4">{item.description.substring(0, 100)}...</p>
//                 <div className="flex justify-between items-center">
//                   <Link
//                     to={`/experience/${item.id}`}
//                     className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300"
//                   >
//                     View Details
//                   </Link>
//                   <button
//                     onClick={() => removeFromWishlist(item.id)}
//                     className="text-red-500 hover:text-red-600 transition duration-300"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;