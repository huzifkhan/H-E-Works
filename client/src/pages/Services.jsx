import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Settings, CheckCircle, Clipboard, Headphones, Lightbulb, Shield } from 'lucide-react';
import { servicesAPI } from '../utils/api';
import SEO from '../components/common/SEO';

const iconMap = {
  briefcase: <Briefcase className="h-10 w-10" />,
  settings: <Settings className="h-10 w-10" />,
  'check-circle': <CheckCircle className="h-10 w-10" />,
  clipboard: <Clipboard className="h-10 w-10" />,
  headphones: <Headphones className="h-10 w-10" />,
  lightbulb: <Lightbulb className="h-10 w-10" />,
  shield: <Shield className="h-10 w-10" />,
};

const colorOptions = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-blue-500',
  'from-red-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-yellow-500 to-orange-500',
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await servicesAPI.getAll();
      const cats = [...new Set((response.data.data || []).map(s => s.category).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const process = [
    { step: '01', title: 'Consult', description: 'Understand your needs and project requirements.' },
    { step: '02', title: 'Plan', description: 'Develop a comprehensive strategy and timeline.' },
    { step: '03', title: 'Execute', description: 'Deliver high-quality work with precision.' },
    { step: '04', title: 'Support', description: 'Provide ongoing support and maintenance.' },
  ];

  return (
    <>
      <SEO
        title="Services"
        description="Explore H&E Works comprehensive consulting services - strategy, innovation, project management, and engineering solutions."
        keywords="business consulting, strategy consulting, engineering services, project management, innovation"
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
              Our Services
            </span>
            <h1 className="heading-1 mb-8 mt-6">
              Solutions That Drive<br />
              <span className="gradient-text">Real Results</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Comprehensive engineering and consulting services tailored to your unique needs and goals.
            </p>
          </div>
        </div>

        {/* Services Grid Image Banner */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <Briefcase className="h-16 w-16 text-primary-600 opacity-50" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Settings className="h-16 w-16 text-purple-600 opacity-50" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-orange-600 opacity-50" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <Lightbulb className="h-16 w-16 text-green-600 opacity-50" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="card group hover:-translate-y-2 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorOptions[index % colorOptions.length]} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {iconMap[service.icon] || <Briefcase className="h-10 w-10" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  {service.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-4">
                      {service.category}
                    </span>
                  )}
                  <Link to="/contact" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group-hover:translate-x-2 duration-300">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4 block">Our Process</span>
            <h2 className="heading-2 text-white mb-6">How We Work</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              A proven methodology that delivers consistent results for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl font-bold text-white/10 mb-4 group-hover:text-primary-500/30 transition-colors duration-300">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
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
                Ready to Get Started?
              </h2>
              <p className="text-primary-100 mb-10 max-w-2xl mx-auto text-lg">
                Schedule a free consultation to discuss your project and 
                discover how H&E Works can help you achieve your goals.
              </p>
              <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
                Contact Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
