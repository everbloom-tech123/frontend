import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ExperienceService from '../Admin_Pages/ExperienceService';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulSubcategories from '../components/PlayfulSubcategories';
import CategoryService from '../Admin_Pages/CategoryService';
import { CircularProgress, Chip, Box } from '@mui/material';
import { debounce } from 'lodash';

const ITEMS_PER_PAGE = 20;

const ViewBySubPage = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [allExperiences, setAllExperiences] = useState([]);
    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentPage = parseInt(searchParams.get('page')) || 1;

    // Debounced function to fetch filtered experiences
    const debouncedFetchFilteredExperiences = useCallback(
        debounce(async (subcategoryIds) => {
            try {
                const filteredData = await ExperienceService.filterBySubcategories(subcategoryIds);
                setAllExperiences(filteredData);
                setFilteredExperiences(filteredData);
            } catch (err) {
                setError(err.message || 'Failed to filter experiences');
                console.error('Error filtering experiences:', err);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    // Fetch initial category and experiences
    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            if (!categoryId) return;

            try {
                setLoading(true);
                setError(null);

                const categoryData = await CategoryService.getCategoryById(categoryId);
                if (!isMounted) return;
                
                setCategory(categoryData);

                // Initialize subcategories from URL if present
                const subcategoryParam = searchParams.get('subcategory');
                if (subcategoryParam) {
                    const selectedNames = subcategoryParam.split(',').map(sub => sub.trim());
                    const selectedSubs = categoryData.subcategories
                        .filter(sub => selectedNames.includes(sub.name))
                        .map(sub => ({
                            id: sub.id,
                            name: sub.name
                        }));
                    setSelectedSubcategories(selectedSubs);
                    
                    if (selectedSubs.length > 0) {
                        const subcategoryIds = selectedSubs.map(sub => sub.id);
                        const filteredData = await ExperienceService.filterBySubcategories(subcategoryIds);
                        if (!isMounted) return;
                        setAllExperiences(filteredData);
                        setFilteredExperiences(filteredData);
                    }
                } else {
                    const allData = await ExperienceService.getExperiencesByCategory(categoryId);
                    if (!isMounted) return;
                    setAllExperiences(allData);
                    setFilteredExperiences(allData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to load category data');
                    console.error('Error loading category:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();

        return () => {
            isMounted = false;
        };
    }, [categoryId]);

    // Handle subcategory selection
    const handleSubcategorySelect = useCallback((subcategoryName) => {
        setSelectedSubcategories(prev => {
            if (!category) return prev;

            const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
            if (!subcategory) return prev;

            const newSelection = prev.some(sub => sub.name === subcategoryName)
                ? prev.filter(sub => sub.name !== subcategoryName)
                : [...prev, { id: subcategory.id, name: subcategory.name }];

            const params = new URLSearchParams(searchParams);
            if (newSelection.length) {
                params.set('subcategory', newSelection.map(sub => sub.name).join(','));
            } else {
                params.delete('subcategory');
            }
            params.set('page', '1');
            setSearchParams(params);

            // If no subcategories selected, fetch all experiences for category
            if (newSelection.length === 0) {
                setLoading(true);
                ExperienceService.getExperiencesByCategory(categoryId)
                    .then(data => {
                        setAllExperiences(data);
                        setFilteredExperiences(data);
                    })
                    .catch(err => {
                        setError(err.message || 'Failed to load experiences');
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(true);
                const subcategoryIds = newSelection.map(sub => sub.id);
                debouncedFetchFilteredExperiences(subcategoryIds);
            }

            return newSelection;
        });
    }, [category, categoryId, searchParams, setSearchParams]);

    const handleClearFilters = useCallback(() => {
        setSelectedSubcategories([]);
        setSearchParams({ page: '1' });
        setLoading(true);
        ExperienceService.getExperiencesByCategory(categoryId)
            .then(data => {
                setAllExperiences(data);
                setFilteredExperiences(data);
            })
            .catch(err => {
                setError(err.message || 'Failed to load experiences');
            })
            .finally(() => setLoading(false));
    }, [categoryId, setSearchParams]);

    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        if (selectedSubcategories.length) {
            params.set('subcategory', selectedSubcategories.map(sub => sub.name).join(','));
        }
        setSearchParams(params);
    }, [searchParams, selectedSubcategories, setSearchParams]);

    const paginatedExperiences = filteredExperiences.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const totalPages = Math.ceil(filteredExperiences.length / ITEMS_PER_PAGE);

    if (error) {
        return (
            <div className="text-center mt-8">
                <h2 className="text-2xl font-bold text-red-600">Error Loading Experiences</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate('/experiences')}
                    className="mb-6 flex items-center text-gray-600 hover:text-red-600"
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
                                        activeSubcategories={selectedSubcategories.map(sub => sub.name)}
                                        subcategories={category.subcategories || []}
                                    />
                                    
                                    {selectedSubcategories.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2 items-center">
                                            <span className="text-gray-600">Selected Filters:</span>
                                            {selectedSubcategories.map(sub => (
                                                <Chip 
                                                    key={sub.id}
                                                    label={sub.name}
                                                    onDelete={() => handleSubcategorySelect(sub.name)}
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

                                <div className="mb-4 text-gray-600">
                                    Showing {filteredExperiences.length} experiences
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