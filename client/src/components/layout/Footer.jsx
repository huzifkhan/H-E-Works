import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding !py-12 md:!py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl md:text-2xl font-bold">H&E Works</span>
            </div>
            <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
              Delivering excellence in engineering and consulting services. 
              Your partner in innovation and sustainable growth.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              {['Home', 'About Us', 'Services', 'Contact'].map((item, index) => {
                const paths = ['/', '/about', '/services', '/contact'];
                return (
                  <li key={index}>
                    <Link
                      to={paths[index]}
                      className="text-sm md:text-base text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block hover:translate-x-1"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Our Services</h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                'Business Consulting',
                'Engineering Solutions',
                'Project Management',
                'Technical Advisory',
              ].map((item, index) => (
                <li key={index} className="text-sm md:text-base text-gray-400 flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
                </div>
                <span className="text-sm md:text-base text-gray-400">Korangi Industrial Area, Karachi</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
                </div>
                <span className="text-sm md:text-base text-gray-400">+92 3102149079</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
                </div>
                <span className="text-sm md:text-base text-gray-400">khuzaifa442@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {currentYear} H&E Works. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 md:gap-x-6 gap-y-2">
              <Link to="#" className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors">
                Terms of Service
              </Link>
              <span className="flex items-center text-gray-500 text-xs md:text-sm">
                Made with <Heart className="h-3 w-3 md:h-4 md:w-4 mx-1 text-red-500 fill-red-500" /> by H&E Works
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
