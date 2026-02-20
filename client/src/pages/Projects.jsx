import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowRight, Filter, Image } from 'lucide-react';
import { projectsAPI } from '../utils/api';
import SEO from '../components/common/SEO';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        projectsAPI.getAll(),
        projectsAPI.getCategories(),
      ]);
      setProjects(projectsRes.data.data?.filter(p => p.is_active) || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <>
      <SEO
        title="Projects"
        description="Explore H&E Works portfolio - Successful projects across infrastructure, building, industrial, and commercial sectors."
        keywords="projects, portfolio, engineering projects, construction, H&E Works"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              Our Portfolio
            </span>
            <h1 className="heading-1 mb-8 mt-6">
              Featured <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Discover our track record of delivering excellence across diverse industries and sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug || project.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0].imageUrl || project.images[0].image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Image className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                        {project.category || 'General'}
                      </span>
                    </div>
                    {project.isFeatured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description available'}
                    </p>

                    <div className="space-y-2 mb-4">
                      {project.clientName && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {project.clientName}
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {project.location}
                        </div>
                      )}
                      {project.completionDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(project.completionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      )}
                      {project.budget && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          ${project.budget.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <Image className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory !== 'all' 
                  ? `No projects in "${selectedCategory}" category`
                  : 'Check back soon for our latest projects'}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="btn-primary"
                >
                  View All Projects
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-3xl p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10">
              <h2 className="heading-2 text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-primary-100 mb-10 max-w-2xl mx-auto text-lg">
                Let's collaborate to bring your vision to life. Contact us today for a free consultation.
              </p>
              <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
