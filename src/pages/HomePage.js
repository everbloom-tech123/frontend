import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/traveTips'; // Import the Header component
import ImageSlider from '../components/ImageSlider';
import ModernHero from '../components/modernHero';
import DestinationExplorer from '../components/Destination';
import ContactForm from './contactForm';
import ImageGrid from '../components/imageLayout';


const HomePage = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [experiencesResponse, categoriesResponse] = await Promise.all([
          ExperienceService.getAllExperiences(),
          CategoryService.getAllCategories()
        ]);

        const featured = Array.isArray(experiencesResponse) ?
            (experiencesResponse.filter(exp => exp.featured).length > 0 ?
                    experiencesResponse.filter(exp => exp.featured) :
                    experiencesResponse.slice(0, 6)
            ) : [];

        setFeaturedExperiences(featured);
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);

      } catch (err) {
        console.error('Error loading homepage data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySelect = (categoryName) => {
    if (categoryName === 'All') {
      navigate('/viewall');
    } else {
      navigate(`/viewall?category=${encodeURIComponent(categoryName)}`);
    }
  };



  const handleExperienceClick = (experience) => {
    navigate(`/experience/${experience.id}`);
  };

  if (error) {
    return (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
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
      <div className="bg-gray-50 min-h-screen">

          {/* Option 2: Using margins */}
          {/* <div className="mt-0 ml-0 mr-auto">
    <ModernHero />
</div> */}
          <div className="pt-16">
              <ModernHero/>
          </div>
          <DestinationExplorer/>
          <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
              <div className="relative mb-16">

                  {/* Most Visited */}
                  {featuredExperiences.length > 0 && (
                      <ExperienceGrid
                          title="Featured Experiences"
                          subtitle="Explore Our Curated Selection of Exclusive Experiences Designed to Create Lasting Memories"
                          experiences={featuredExperiences}
                          columns={3}
                          onExperienceClick={handleExperienceClick}
                          isLoading={loading}
                      />
                  )}

                  <Header/>


              </div>
          </div>
          {/* Main Content */}

          {/*    {featuredExperiences.length > 3 && (*/}
          {/*        <ExperienceGrid*/}
          {/*            title="Featured Experiences"*/}
          {/*            subtitle="Highlighting the best and most unique offerings, carefully selected to provide exceptional value and unforgettable moments."*/}
          {/*            experiences={featuredExperiences}*/}
          {/*            columns={3}*/}
          {/*            onExperienceClick={handleExperienceClick}*/}
          {/*            isLoading={loading}*/}
          {/*        />*/}
          {/*    )}*/}

          {/*     Categories Section */}
          {/*    {categories.length > 0 && (*/}
          {/*        <PlayfulCategories*/}
          {/*            categories={categories}*/}
          {/*            onCategorySelect={handleCategorySelect}*/}
          {/*            activeCategory="All"*/}
          {/*        />*/}
          {/*    )}*/}


          <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
              <div className="relative mb-16">

                  {/* Most Visited */}
                  {featuredExperiences.length > 0 && (
                      <ExperienceGrid
                          title="Most Viewd Experiences"
                          subtitle="The top experiences that have captured the interest of the most visitors, offering exceptional popularity and appeal."
                          experiences={featuredExperiences}
                          columns={3}
                          onExperienceClick={handleExperienceClick}
                          isLoading={loading}
                      />
                  )}

                  <ImageGrid/>

                  {/* <ContactForm /> */}
                  {/* Newsletter Section */}

              </div>
          </div>
      </div>
  );
};

export default HomePage;