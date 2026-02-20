import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, ArrowDown, Phone, Star, Quote, Image, MapPin } from 'lucide-react';
import { servicesAPI, testimonialsAPI, projectsAPI } from '../utils/api';
import SEO from '../components/common/SEO';
import { images } from '../utils/images';

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, testimonialsRes, projectsRes] = await Promise.all([
        servicesAPI.getAll(),
        testimonialsAPI.getAll(),
        projectsAPI.getAll({ featured: 'true' }),
      ]);
      setServices(servicesRes.data.data?.filter(s => s.is_active) || []);
      setTestimonials(testimonialsRes.data.data?.filter(t => t.is_approved) || []);
      setFeaturedProjects(projectsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Business Growth',
      description: 'Strategic planning and execution to drive sustainable business growth.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Team',
      description: 'Work with experienced professionals dedicated to your success.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Trusted Partner',
      description: 'Reliable solutions with a proven track record of excellence.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Fast Results',
      description: 'Efficient processes that deliver results without compromising quality.',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Projects Completed', sub: 'Successfully delivered' },
    { value: '98%', label: 'Client Satisfaction', sub: 'Positive feedback' },
    { value: '15+', label: 'Years Experience', sub: 'Industry expertise' },
    { value: '50+', label: 'Team Members', sub: 'Dedicated experts' },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="H&E Works - Professional engineering and consulting services. Expert solutions for modern businesses."
        keywords="H&E Works, engineering, consulting, business solutions, professional services"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 md:w-80 md:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 md:w-80 md:h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-primary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="container-custom relative z-10 py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-6 md:mb-8 animate-slide-down">
              <span className="text-xs md:text-sm font-medium text-primary-600">🚀 Welcome to H&E Works</span>
            </div>
            
            <h1 className="heading-1 mb-6 md:mb-8 animate-slide-up">
              Engineering Excellence,<br />
              <span className="gradient-text">Delivered with Precision</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We combine cutting-edge engineering with strategic consulting to transform your vision into reality. 
              Trusted by industry leaders worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/contact" className="btn-primary">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link to="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <ArrowDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
        </div>
      </section>

      {/* Hero Image Banner */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={images.hero} 
            alt="Modern office building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-accent-900/80" />
        </div>
        <div className="container-custom relative z-10 h-full flex items-center">
          <div className="text-white px-4">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Transforming Businesses Since 2010</h2>
            <p className="text-sm md:text-lg text-white/90 max-w-2xl">Industry-leading engineering and consulting solutions</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16 px-4">
            <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 md:mb-4 block">Why Choose H&E Works</span>
            <h2 className="heading-2 mb-4 md:mb-6">Built for Success</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              We deliver comprehensive solutions that drive measurable results for your business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group hover:-translate-y-2"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto sm:mx-0`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-center sm:text-left">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center sm:text-left">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-10 md:mb-16 px-4">
            <span className="text-xs md:text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3 md:mb-4 block">Our Track Record</span>
            <h2 className="heading-2 text-white mb-4 md:mb-6">Numbers That Speak</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group px-2">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-white font-semibold text-sm md:text-lg mb-1 md:mb-2">{stat.label}</div>
                <div className="text-gray-400 text-xs md:text-sm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 md:mb-4 block">Our Services</span>
            <h2 className="heading-2 mb-4 md:mb-6">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Professional services tailored to your needs
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="card group hover:-translate-y-2 cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.icon ? `from-primary-500 to-accent-500` : 'from-primary-500 to-cyan-500'} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl font-bold">{service.icon ? service.icon[0].toUpperCase() : 'S'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{service.description}</p>
                  {service.category && (
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 md:mb-4 block">Portfolio</span>
            <h2 className="heading-2 mb-4 md:mb-6">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Explore our latest work and success stories
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0].imageUrl || project.images[0].image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {project.isFeatured && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                        {project.category || 'General'}
                      </span>
                      {project.location && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description available'}
                    </p>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors text-sm"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
              <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No featured projects available yet</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/projects" className="btn-primary">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 md:mb-4 block">Testimonials</span>
            <h2 className="heading-2 mb-4 md:mb-6">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Trusted by industry leaders worldwide
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading testimonials...</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="card hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.clientName}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.clientTitle} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex items-start space-x-2">
                      <Quote className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 italic line-clamp-4">{testimonial.testimonial}</p>
                    </div>
                  </div>
                  {testimonial.projectType && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {testimonial.projectType}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Quote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No testimonials available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-20 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
            
            <div className="relative z-10">
              <h2 className="heading-2 text-white mb-4 md:mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-primary-100 mb-8 md:mb-10 max-w-2xl mx-auto text-sm md:text-lg px-4">
                Let's discuss how H&E Works can help you achieve your goals. 
                Schedule a free consultation with our experts today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <a href="tel:+923102149079" className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white/10 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm text-sm md:text-base">
                  <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  +92 3102149079
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
