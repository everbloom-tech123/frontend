import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, Instagram, MapPin, Mail, Phone } from 'lucide-react';
import { useInquiry } from '../services/inquiryService';

const ContactForm = () => {
  const { submitInquiry } = useInquiry();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    inquiryType: '',
    email: '',
    name: '',
    country: '',
    message: '',
    subject: '' // Added to match the InquiryDTO
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.inquiryType) newErrors.inquiryType = 'Required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    if (!formData.message) newErrors.message = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus({ type: '', message: '' });

      try {
        // Transform formData to match InquiryDTO
        const inquiryDTO = {
          name: formData.name,
          email: formData.email,
          subject: formData.inquiryType, // Using inquiryType as subject
          message: formData.message,
          location: formData.country // Using country as location
        };

        const result = await submitInquiry(inquiryDTO);
        setSubmitStatus({
          type: 'success',
          message: 'Your inquiry has been submitted successfully!'
        });
        // Reset form after successful submission
        setFormData({
          inquiryType: '',
          email: '',
          name: '',
          country: '',
          message: '',
          subject: ''
        });
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: error.message || 'An error occurred while submitting your inquiry.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Column - Image and Contact Info */}
      <div 
        className="relative h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2054&auto=format&fit=crop')`
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70">
          <div className="p-16 text-white h-full flex flex-col">
            <h2 className="text-5xl font-bold mb-20">Our Head Office</h2>
            
            <div className="space-y-12 mb-12">
              <div className="flex items-center gap-6">
                <MapPin className="w-8 h-8" />
                <div className="text-xl">
                  <p>No: 58 A, East Madison Street,</p>
                  <p>Baltimore, MD, USA 4508</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Phone className="w-8 h-8" />
                <p className="text-xl">000 - 123 - 456789</p>
              </div>
              
              <div className="flex items-center gap-6">
                <Mail className="w-8 h-8" />
                <p className="text-xl">info@example.com</p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex gap-6">
                <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Facebook className="w-7 h-7 text-gray-900" />
                </a>
                <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Twitter className="w-7 h-7 text-gray-900" />
                </a>
                <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Youtube className="w-7 h-7 text-gray-900" />
                </a>
                <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Instagram className="w-7 h-7 text-gray-900" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Contact Form */}
      <div className="p-16 bg-white relative overflow-hidden">
        <div className="mb-16 relative">
          <p className="text-2xl mb-2" style={{ fontFamily: 'Permanent Marker, cursive' }}>Reach Us</p>
          <h1 className="text-6xl font-bold">Contact form</h1>
          <div className="text-[200px] font-bold text-gray-100 absolute -right-20 -top-16 -z-10 opacity-50">
            Enquiry
          </div>
        </div>

        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="relative grid md:grid-cols-2 gap-12">
            <div>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={`w-full pb-3 bg-transparent border-b-2 ${
                  errors.inquiryType ? 'border-red-500' : 'border-gray-300'
                } focus:border-gray-900 focus:outline-none appearance-none text-lg`}
              >
                <option value="">Inquiry types*</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
              </select>
              {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="E-mail*"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pb-3 bg-transparent border-b-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:border-gray-900 focus:outline-none text-lg`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name*"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pb-3 bg-transparent border-b-2 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:border-gray-900 focus:outline-none text-lg`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full pb-3 bg-transparent border-b-2 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                } focus:border-gray-900 focus:outline-none appearance-none text-lg`}
              >
                <option value="">Country*</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Message*"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`w-full pb-3 bg-transparent border-b-2 ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              } focus:border-gray-900 focus:outline-none text-lg resize-none`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <div className="pt-12 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;