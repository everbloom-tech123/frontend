// // Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="bg-gray-800 text-white h-full w-64 p-6 flex flex-col">
//       <div className="mb-6">
//         <Link to="/" className="text-xl font-bold">
//           Experience Manager
//         </Link>
//       </div>
//       <nav>
//         <ul className="space-y-4">
//           <li>
//             <Link to="/dashboard" className="hover:text-gray-400">
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/experiences" className="hover:text-gray-400">
//               Experiences
//             </Link>
//           </li>
//           <li>
//             <Link to="/users" className="hover:text-gray-400">
//               Users
//             </Link>
//           </li>
//           <li>
//             <Link to="/orders" className="hover:text-gray-400">
//               Orders
//             </Link>
//           </li>
//           <li>
//             <Link to="/settings" className="hover:text-gray-400">
//               Settings
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;