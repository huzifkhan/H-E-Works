import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Users,
} from 'lucide-react';
import api from '../utils/api';
import SEO from '../components/common/SEO';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      let response;
      
      // Try by slug first, then by ID
      if (slug.includes('-')) {
        response = await api.get(`/projects/slug/${slug}`);
      } else {
        response = await api.get(`/projects/${slug}`);
      }
      
      const projectData = response.data.data;
      setProject(projectData);
      
      // Set SEO dynamically
      document.title = `${projectData.title} - H&E Works`;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const images = project?.images || [];
  
  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link to="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.description || `Learn about ${project.title} by H&E Works`}
        keywords={`${project.title}, ${project.category}, engineering, portfolio`}
      />

      {/* Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Link
            to="/projects"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-96 md:h-[500px] overflow-hidden bg-gray-900">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]?.imageUrl || images[currentImageIndex]?.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <ImageIcon className="h-24 w-24 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-custom relative z-10">
            <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full mb-4">
              {project.category || 'General'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{project.title}</h1>
            {project.clientName && (
              <p className="text-white/90 text-lg">Client: {project.clientName}</p>
            )}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {project.description || 'No description available.'}
                </p>
              </div>

              {/* Additional Images Grid */}
              {images.length > 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {images.slice(1).map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index + 1)}
                        className="group relative aspect-square rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={image.imageUrl || image.image_url}
                          alt={image.caption || `Project image ${index + 2}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-white text-xs">{image.caption}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>
                
                <div className="space-y-4">
                  {project.category && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Category</p>
                        <p className="text-gray-900 font-semibold">{project.category}</p>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Location</p>
                        <p className="text-gray-900 font-semibold">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Completed</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(project.completionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Budget</p>
                        <p className="text-gray-900 font-semibold">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.clientName && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Client</p>
                        <p className="text-gray-900 font-semibold">{project.clientName}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link to="/contact" className="btn-primary w-full justify-center">
                    Start Your Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-2 mb-6">Have a Similar Project?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Let's discuss how we can bring your vision to life with the same level of excellence.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
