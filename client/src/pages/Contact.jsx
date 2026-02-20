import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageCircle, Paperclip, X, FileText } from 'lucide-react';
import { images } from '../utils/images';
import { contactAPI } from '../utils/api';
import SEO from '../components/common/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    const validFiles = selectedFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        setStatus({
          type: 'error',
          message: `File type not allowed: ${file.name}. Please upload images, PDFs, or Office documents.`,
        });
        return false;
      }
      if (file.size > maxSize) {
        setStatus({
          type: 'error',
          message: `File too large: ${file.name}. Max size is 5MB.`,
        });
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);
    setStatus({ type: '', message: '' });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      files.forEach(file => {
        submitData.append('attachments', file);
      });

      const response = await contactAPI.submitMultipart(submitData);
      setStatus({
        type: 'success',
        message: response.data.message || 'Thank you! We will get back to you within 24 hours.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      value: 'khuzaifa442@gmail.com',
      href: 'mailto:khuzaifa442@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      value: '+92 3102149079',
      href: 'tel:+923102149079',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Us',
      value: 'Korangi Industrial Area, Karachi',
      href: '#',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      value: 'Mon - Sat: 9:00 AM - 6:00 PM',
      href: '#',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with H&E Works. We're here to help your business succeed with expert consulting and engineering services."
        keywords="contact H&E Works, get in touch, business inquiry, consulting"
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
              Contact Us
            </span>
            <h1 className="heading-1 mb-8 mt-6">
              Let's Start a<br />
              <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Have a question or ready to begin your project? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="card group hover:-translate-y-2 block"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{item.title}</h3>
                <p className="text-gray-900 font-semibold">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 block">Get in Touch</span>
              <h2 className="heading-3 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {status.message && (
                <div
                  className={`mb-6 p-5 rounded-xl flex items-center ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                  )}
                  <span className="font-medium">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select a topic</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Project Consultation">Project Consultation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors bg-gray-50"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Images, PDFs, Word, Excel (Max 5MB each, 5 files max)
                    </p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map / Info */}
            <div>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 block">Our Location</span>
              <h2 className="heading-3 mb-6">Visit Our Office</h2>
              <div className="rounded-2xl overflow-hidden shadow-xl h-64 md:h-80 mb-8">
                <img 
                  src={images.location} 
                  alt="Office location map" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="card !p-8">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold mb-2">Let's Talk</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Ready to discuss your project? Our team is standing by to help you 
                      find the perfect solution for your business needs.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-primary-600 mr-3" />
                    khuzaifa442@gmail.com
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 text-primary-600 mr-3" />
                    +92 3102149079
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-primary-600 mr-3" />
                    Korangi Industrial Area, Karachi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
