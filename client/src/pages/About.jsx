import { CheckCircle, Award, Target, Lightbulb, Users, Globe, Heart, Shield } from 'lucide-react';
import SEO from '../components/common/SEO';
import { images } from '../utils/images';

const About = () => {
  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: '15+ years in engineering leadership',
      image: images.professional1,
    },
    {
      name: 'Sarah Johnson',
      role: 'Chief Operating Officer',
      bio: 'Expert in operations management',
      image: images.professional2,
    },
    {
      name: 'Michael Chen',
      role: 'Head of Engineering',
      bio: 'Specialist in structural engineering',
      image: images.professional3,
    },
    {
      name: 'Emily Davis',
      role: 'Project Director',
      bio: '10+ years managing large-scale projects',
      image: images.professional4,
    },
  ];
  const stats = [
    { value: '15+', label: 'Years of Excellence', sub: 'Since 2010' },
    { value: '500+', label: 'Projects Delivered', sub: 'Successfully completed' },
    { value: '200+', label: 'Happy Clients', sub: 'Across 20+ industries' },
    { value: '50+', label: 'Expert Professionals', sub: 'Dedicated team' },
  ];

  const mission = {
    title: 'Our Mission',
    content: 'To deliver exceptional engineering and construction solutions that transform our clients\' visions into reality. We are committed to excellence, innovation, and sustainability in every project we undertake, while fostering long-term relationships built on trust and mutual success.',
    icon: <Target className="h-12 w-12" />,
  };

  const vision = {
    title: 'Our Vision',
    content: 'To be the leading engineering and construction company in the region, recognized for our commitment to quality, innovation, and client satisfaction. We envision a future where every project we complete sets a new standard for excellence in the industry.',
    icon: <Lightbulb className="h-12 w-12" />,
  };

  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, delivering quality that exceeds expectations and setting new industry standards.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Integrity',
      description: 'Honest and transparent in all our dealings, we build trust through our actions and uphold the highest ethical standards.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Constantly evolving to stay ahead of the curve, we embrace cutting-edge technology and creative solutions.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Client Focus',
      description: 'Your success is our top priority. We measure our achievements by your satisfaction and long-term partnership.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Teamwork',
      description: 'We believe in the power of collaboration, bringing together diverse expertise to solve complex challenges.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Sustainability',
      description: 'Committed to environmentally responsible practices and sustainable development for future generations.',
      color: 'from-emerald-500 to-green-500',
    },
  ];

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about H&E Works - our mission, values, and the expert team dedicated to your success."
        keywords="about H&E Works, engineering company, consulting team, mission, values"
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
              About H&E Works
            </span>
            <h1 className="heading-1 mb-8 mt-6">
              Building the Future,<br />
              <span className="gradient-text">One Project at a Time</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are a team of dedicated professionals committed to helping businesses 
              achieve their full potential through innovative engineering and strategic consulting.
            </p>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-12 md:mt-16 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={images.aboutHero} 
            alt="H&E Works office workspace" 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card !p-10 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
              <div className="flex items-center mb-6">
                {mission.icon}
                <h2 className="heading-3 ml-4">{mission.title}</h2>
              </div>
              <p className="text-primary-100 mb-8 text-lg leading-relaxed">
                {mission.content}
              </p>
              <ul className="space-y-4">
                {[
                  'Deliver exceptional value to every client',
                  'Foster innovation and continuous improvement',
                  'Build lasting partnerships based on trust',
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-primary-50">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card !p-10 bg-gradient-to-br from-accent-600 to-accent-700 text-white">
              <div className="flex items-center mb-6">
                {vision.icon}
                <h2 className="heading-3 ml-4">{vision.title}</h2>
              </div>
              <p className="text-accent-100 mb-8 text-lg leading-relaxed">
                {vision.content}
              </p>
              <ul className="space-y-4">
                {[
                  'Industry leadership and recognition',
                  'Global reach with local expertise',
                  'Measurable impact on client success',
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-accent-50">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 block">Our Core Values</span>
            <h2 className="heading-2 mb-6">What Drives Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              These principles guide everything we do and shape our approach to client partnerships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center group hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 block">Our Leadership</span>
            <h2 className="heading-2 mb-6">Meet the Experts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our experienced team brings decades of combined expertise to help you succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center group hover:-translate-y-2">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4 block">Our Story</span>
            <h2 className="heading-2 text-white mb-8">From Humble Beginnings to Industry Leaders</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Founded in 2010, H&E Works started with a simple belief: every business deserves 
              access to expert engineering and strategic guidance. Today, we've grown to a 
              team of 50+ professionals serving clients across industries worldwide.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our journey has been defined by a commitment to excellence, innovation, and 
              most importantly, the success of our clients. We've helped over 500 businesses 
              achieve their goals and continue to grow every day.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
