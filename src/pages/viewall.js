import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ExperienceService from '../Admin_Pages/ExperienceService';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';
import { CircularProgress, Box, Chip } from '@mui/material';

const ITEMS_PER_PAGE = 20;

const ViewAllExperiencesPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    const currentPage = parseInt(pageParam) || 1;
    
    const [categories, setCategories] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories and initial experiences
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const categoriesData = await CategoryService.getAllCategories();
                setCategories(categoriesData);

                // If category is specified in URL, fetch that category's experiences
                if (categoryParam) {
                    const category = categoriesData.find(cat => cat.name === categoryParam);
                    if (category) {
                        setSelectedCategory(category);
                        const categoryExperiences = await ExperienceService.getExperiencesByCategory(category.id);
                        setExperiences(categoryExperiences);
                    }
                } else {
                    // Otherwise fetch all experiences
                    const allExperiences = await ExperienceService.getAllExperiences();
                    setExperiences(allExperiences);
                }
            } catch (err) {
                setError(err.message || 'Failed to load data');
                console.error('Error loading initial data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [categoryParam]);

    const handleCategorySelect = async (categoryName) => {
        try {
            setLoading(true);
            if (categoryName === 'All') {
                const allExperiences = await ExperienceService.getAllExperiences();
                setExperiences(allExperiences);
                setSelectedCategory(null);
                setSearchParams({ page: '1' });
            } else {
                const category = categories.find(cat => cat.name === categoryName);
                if (category) {
                    const categoryExperiences = await ExperienceService.getExperiencesByCategory(category.id);
                    setExperiences(categoryExperiences);
                    setSelectedCategory(category);
                    setSearchParams({ category: categoryName, page: '1' });
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load experiences');
            console.error('Error loading category experiences:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        if (selectedCategory) {
            params.set('category', selectedCategory.name);
        }
        setSearchParams(params);
    };

    const handleClearCategory = () => {
        setSelectedCategory(null);
        setSearchParams({ page: '1' });
        handleCategorySelect('All');
    };

    // Pagination
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
        <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <div className="mb-8">
                            <PlayfulCategories
                                categories={categories}
                                onCategorySelect={handleCategorySelect}
                                activeCategory={selectedCategory ? selectedCategory.name : 'All'}
                            />

                            {selectedCategory && (
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-gray-600">Selected Category:</span>
                                    <Chip
                                        label={selectedCategory.name}
                                        onDelete={handleClearCategory}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </div>
                            )}
                        </div>

                        <ExperienceGrid
                            title={selectedCategory ? `${selectedCategory.name} Experiences` : "All Experiences"}
                            subtitle="Discover amazing experiences waiting for you..."
                            experiences={paginatedExperiences}
                            isLoading={loading}
                            columns={3}
                            showPrice={true}
                            showViewDetails={true}
                            className="mt-8"
                        />

                        {!loading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                    First
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-4 py-2 rounded-lg ${
                                                    currentPage === pageNumber
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }
                                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                        return <span key={pageNumber}>...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Last
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewAllExperiencesPage;