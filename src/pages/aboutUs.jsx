import React from 'react';
import { Gift, Users, Star, Globe, Coffee, Compass, Sun } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: <Gift className="w-8 h-8 text-red-500" />, value: "500+", label: "Curated Experiences" },
    { icon: <Users className="w-8 h-8 text-red-500" />, value: "50,000+", label: "Happy Adventurers" },
    { icon: <Star className="w-8 h-8 text-red-500" />, value: "4.8/5", label: "Excellence Rating" },
    { icon: <Globe className="w-8 h-8 text-red-500" />, value: "25+", label: "Destinations" },
  ];

  const experiences = [
    {
      icon: <Coffee className="w-6 h-6 text-red-500" />,
      title: "Tea Estate Tours",
      description: "Journey through Ceylon's historic tea plantations, learning the art of tea making from master craftsmen."
    },
    {
      icon: <Compass className="w-6 h-6 text-red-500" />,
      title: "Cultural Expeditions",
      description: "Explore ancient temples, traditional crafts, and sacred sites with expert local guides."
    },
    {
      icon: <Sun className="w-6 h-6 text-red-500" />,
      title: "Coastal Adventures",
      description: "Discover pristine beaches, marine life, and coastal communities along our tropical shores."
    }
  ];

  const team = [
    {
      name: "Amara Perera",
      position: "Founder & Cultural Expert",
      bio: "With 15 years of experience in luxury travel and a deep connection to Sri Lankan heritage, Amara brings authentic cultural experiences to life."
    },
    {
      name: "Raj Mendis",
      position: "Head of Experiences",
      bio: "A former adventure guide turned experience curator, Raj combines his passion for exploration with meticulous attention to detail."
    },
    {
      name: "Maya Silva",
      position: "Community Relations Director",
      bio: "Maya's expertise in sustainable tourism and community development ensures our experiences benefit local communities."
    }
  ];

  return (
      <div className="pt-16">
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-green-700 to-red-500 text-white py-32">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Discover the Heart of Ceylon</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light">
                Crafting extraordinary moments through meticulously curated experiences that reveal the authentic soul
                of Sri Lanka
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                  <div key={index}
                       className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border-b-2 border-red-400">
                    <div className="flex justify-center mb-4">{stat.icon}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Our Legacy</h2>
              <div className="w-24 h-1 bg-red-400 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Founded in 2023, Ceylon Bucket emerged from a profound desire to share Sri Lanka's extraordinary
                heritage with discerning travelers. We believe that truly remarkable journeys transcend mere
                sightseeing—they're transformative experiences that forge deep connections with our island's rich
                culture, warm-hearted people, and timeless traditions.
              </p>
            </div>

            {/* Featured Experiences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {experiences.map((exp, index) => (
                  <div key={index}
                       className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group hover:bg-red-50">
                    <div className="flex items-center mb-4">
                      {exp.icon}
                      <h3 className="text-xl font-semibold text-gray-900 ml-3 group-hover:text-red-600">{exp.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-red-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-16">Our Principles</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div
                    className="text-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentic Experiences</h3>
                  <p className="text-gray-600 leading-relaxed">We carefully curate each experience to reveal the true
                    essence of Sri Lanka, from ancient traditions to modern cultural expressions.</p>
                </div>
                <div
                    className="text-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sustainable Tourism</h3>
                  <p className="text-gray-600 leading-relaxed">Every adventure is designed with environmental
                    consciousness at its core, supporting local conservation efforts and communities.</p>
                </div>
                <div
                    className="text-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Excellence in Service</h3>
                  <p className="text-gray-600 leading-relaxed">Our dedication to exceptional service means personalized
                    attention, expert guidance, and seamless logistics throughout your journey.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-16">Our Experts</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {team.map((member, index) => (
                    <div key={index} className="text-center group">
                      <div
                          className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-red-200 group-hover:ring-red-300 transition-all duration-300">
                        <img
                            src="/api/placeholder/160/160"
                            alt={member.name}
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                      <p className="text-red-500 font-medium mb-4">{member.position}</p>
                      <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-red-400 to-red-500 text-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-serif font-bold mb-6">Begin Your Ceylon Journey</h2>
              <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Let us craft an extraordinary journey that captures the essence of Sri Lanka's timeless beauty and rich
                cultural heritage.
              </p>
              <button
                  className="bg-white text-red-600 px-12 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg shadow-lg hover:shadow-xl">
                Start Planning
              </button>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="bg-gray-900 text-white py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="text-2xl font-serif italic">
                "In Ceylon, every journey becomes a story, every moment a memory, and every experience a treasure."
              </p>
            </div>
          </div>
        </div>
      </div>
        );
        };

    export default AboutUs;
