import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ExperienceService from '../Admin_Pages/ExperienceService';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulSubcategories from '../components/PlayfulSubcategories';
import CategoryService from '../Admin_Pages/CategoryService';
import { CircularProgress, Chip, Box } from '@mui/material';

const ViewBySubPage = () => {
   const { categoryId } = useParams();
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();

   const subcategoryParam = searchParams.get('subcategory');
   const initialSelectedSubcategories = subcategoryParam 
       ? subcategoryParam.split(',').map(sub => sub.trim())
       : [];

   const [selectedSubcategories, setSelectedSubcategories] = useState(initialSelectedSubcategories);
   const [experiences, setExperiences] = useState([]);
   const [category, setCategory] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
       const fetchData = async () => {
           if (!categoryId) return;

           try {
               setLoading(true);
               setError(null);

               const categoryData = await CategoryService.getCategoryById(categoryId);
               setCategory(categoryData);

               if (selectedSubcategories.length > 0) {
                   const subIds = categoryData.subcategories
                       .filter(sub => selectedSubcategories.includes(sub.name))
                       .map(sub => sub.id);
                   
                   if (subIds.length > 0) {
                       const data = await ExperienceService.getExperiencesBySubcategories(subIds);
                       setExperiences(data);
                   } else {
                       setExperiences([]);
                   }
               } else {
                   const data = await ExperienceService.getExperiencesByCategory(categoryId);
                   setExperiences(data);
               }
           } catch (err) {
               console.error('Error fetching data:', err);
               setError(err.message || 'Failed to load experiences');
           } finally {
               setLoading(false);
           }
       };

       fetchData();
   }, [categoryId, selectedSubcategories]);

   const handleSubcategorySelect = (subcategoryName) => {
       setSelectedSubcategories(prev => {
           const newSelection = prev.includes(subcategoryName)
               ? prev.filter(sub => sub !== subcategoryName)
               : [...prev, subcategoryName];
           
           // Create new URLSearchParams object
           const newParams = new URLSearchParams(searchParams);
           
           if (newSelection.length) {
               newParams.set('subcategory', newSelection.join(','));
           } else {
               newParams.delete('subcategory');
           }
           
           // Use absolute path with current categoryId
           navigate({
               pathname: `/experiences/category/${categoryId}`,
               search: newParams.toString()
           });
           
           return newSelection;
       });
   };

   const handleClearFilters = () => {
       setSelectedSubcategories([]);
       navigate(`/experiences/category/${categoryId}`);
   };

   const handleExperienceClick = (experience) => {
       navigate(`/experience/${experience.id}`);
   };

   if (error) {
       return (
           <div className="text-center mt-8">
               <h2 className="text-2xl font-bold text-red-600">Error Loading Experiences</h2>
               <p className="text-gray-600 mt-2">{error}</p>
               <button
                   onClick={() => window.location.reload()}
                   className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
               >
                   Try Again
               </button>
           </div>
       );
   }

   return (
       <div className="bg-gray-50 min-h-screen mt-16">
           <div className="container mx-auto px-4 py-12">
               <button
                   onClick={() => navigate('/experiences')}
                   className="mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors"
               >
                   <svg
                       className="w-5 h-5 mr-2"
                       fill="none"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth="2"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                   >
                       <path d="M15 19l-7-7 7-7" />
                   </svg>
                   Back to All Experiences
               </button>

               {loading ? (
                   <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                       <CircularProgress color="primary" />
                   </Box>
               ) : (
                   <>
                       {category && (
                           <>
                               <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                   {category.name} Experiences
                               </h1>

                               <div className="mb-6">
                                   <PlayfulSubcategories
                                       categoryId={categoryId}
                                       onSubcategorySelect={handleSubcategorySelect}
                                       activeSubcategories={selectedSubcategories}
                                       subcategories={category.subcategories || []}
                                   />
                                   
                                   {selectedSubcategories.length > 0 && (
                                       <div className="mt-4 flex flex-wrap gap-2 items-center">
                                           <span className="text-gray-600">Selected Filters:</span>
                                           {selectedSubcategories.map(sub => (
                                               <Chip
                                                   key={sub}
                                                   label={sub}
                                                   onDelete={() => handleSubcategorySelect(sub)}
                                                   color="primary"
                                                   variant="outlined"
                                               />
                                           ))}
                                           <Chip
                                               label="Clear All"
                                               onClick={handleClearFilters}
                                               color="secondary"
                                               variant="outlined"
                                           />
                                       </div>
                                   )}
                               </div>

                               <ExperienceGrid
                                   title={`Discover ${category.name} Experiences`}
                                   subtitle={
                                       selectedSubcategories.length > 0
                                           ? experiences.length > 0
                                               ? `Exploring ${selectedSubcategories.join(', ')} adventures...`
                                               : `No experiences found for ${selectedSubcategories.join(', ')}`
                                           : `Explore all ${category.name} adventures...`
                                   }
                                   experiences={experiences}
                                   onExperienceClick={handleExperienceClick}
                                   isLoading={loading}
                                   columns={3}
                                   showPrice={true}
                                   showViewDetails={true}
                                   className="mt-8"
                               />
                           </>
                       )}
                   </>
               )}
           </div>
       </div>
   );
};

export default ViewBySubPage;