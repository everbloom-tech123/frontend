import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

const PlayfulSubcategories = ({ categoryId, onSubcategorySelect, activeSubcategories, subcategories }) => {
 return (
   <motion.div
     className="mb-8"
     initial="hidden"
     animate="visible"
     variants={{
       hidden: { opacity: 0 },
       visible: { opacity: 1 }
     }}
   >
     <div className="flex flex-wrap justify-center gap-4">
       {subcategories?.map((subcategory) => (
         <motion.button
           key={subcategory.id}
           onClick={() => onSubcategorySelect(subcategory.name)}
           className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300
             ${activeSubcategories.includes(subcategory.name)
               ? 'bg-red-600 text-white shadow-lg'
               : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
             }`}
         >
           <Tag className="mr-2 h-4 w-4" />
           {subcategory.name}
         </motion.button>
       ))}
     </div>
   </motion.div>
 );
};

export default PlayfulSubcategories;
