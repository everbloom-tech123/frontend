import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ExperienceService from '../Admin_Pages/ExperienceService';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulSubcategories from '../components/PlayfulSubcategories';
import CategoryService from '../Admin_Pages/CategoryService';
import { CircularProgress, Chip, Box } from '@mui/material';

const ITEMS_PER_PAGE = 20;

const ViewBySubPage = () => {
   const { categoryId } = useParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();

   const subcategoryParam = searchParams.get('subcategory');
   const currentPage = parseInt(searchParams.get('page')) || 1;
   
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
               setError(err.message || 'Failed to load experiences');
           } finally {
               setLoading(false);
           }
       };

       fetchData();
   }, [categoryId, selectedSubcategories]);

   const handlePageChange = (newPage) => {
       const params = new URLSearchParams(searchParams);
       params.set('page', newPage.toString());
       if (selectedSubcategories.length) {
           params.set('subcategory', selectedSubcategories.join(','));
       }
       setSearchParams(params);
   };

   const handleSubcategorySelect = (subcategoryName) => {
       setSelectedSubcategories(prev => {
           const newSelection = prev.includes(subcategoryName)
               ? prev.filter(sub => sub !== subcategoryName)
               : [...prev, subcategoryName];
           
           const params = new URLSearchParams(searchParams);
           if (newSelection.length) {
               params.set('subcategory', newSelection.join(','));
           } else {
               params.delete('subcategory');
           }
           params.set('page', '1');
           setSearchParams(params);
           
           return newSelection;
       });
   };

   const handleClearFilters = () => {
       setSelectedSubcategories([]);
       setSearchParams({ page: '1' });
   };

   const paginatedExperiences = experiences.slice(
       (currentPage - 1) * ITEMS_PER_PAGE,
       currentPage * ITEMS_PER_PAGE
   );
   
   const totalPages = Math.ceil(experiences.length / ITEMS_PER_PAGE);

   if (error) {
       return (
           <div className="text-center mt-8">
               <h2 className="text-2xl font-bold text-red-600">Error Loading Experiences</h2>
               <p className="text-gray-600 mt-2">{error}</p>
               <button onClick={() => window.location.reload()} 
                       className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                   Try Again
               </button>
           </div>
       );
   }

   return (
       <div className="min-h-screen">
           <div className="container mx-auto px-4 py-8">
               <button onClick={() => navigate('/experiences')}
                       className="mb-6 flex items-center text-gray-600 hover:text-red-600">
                   <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                       <path d="M15 19l-7-7 7-7" />
                   </svg>
                   Back to All Experiences
               </button>

               {loading ? (
                   <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                       <CircularProgress />
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
                                               <Chip key={sub} label={sub}
                                                     onDelete={() => handleSubcategorySelect(sub)}
                                                     color="primary" variant="outlined" />
                                           ))}
                                           <Chip label="Clear All" onClick={handleClearFilters}
                                                 color="secondary" variant="outlined" />
                                       </div>
                                   )}
                               </div>

                               <ExperienceGrid
                                   experiences={paginatedExperiences}
                                   isLoading={loading}
                                   columns={3}
                                   showPrice={true}
                                   showViewDetails={true}
                                   className="mt-8"
                               />

                               {!loading && totalPages > 1 && (
                                   <div className="flex justify-center items-center gap-2 mt-8">
                                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                           <button
                                               key={page}
                                               onClick={() => handlePageChange(page)}
                                               className={`px-4 py-2 rounded ${
                                                   currentPage === page 
                                                       ? 'bg-red-600 text-white' 
                                                       : 'bg-gray-200 hover:bg-gray-300'
                                               }`}
                                           >
                                               {page}
                                           </button>
                                       ))}
                                   </div>
                               )}
                           </>
                       )}
                   </>
               )}
           </div>
       </div>
   );
};

export default ViewBySubPage;