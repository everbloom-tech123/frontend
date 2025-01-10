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
    subject: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.inquiryType) newErrors.inquiryType = 'Inquiry type is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus({ type: '', message: '' });

      try {
        const inquiryDTO = {
          name: formData.name,
          email: formData.email,
          subject: formData.inquiryType,
          message: formData.message,
          location: formData.country
        };

        const result = await submitInquiry(inquiryDTO);
        setSubmitStatus({
          type: 'success',
          message: 'Your inquiry has been submitted successfully!'
        });
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
    <div className="pt-16">
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-700 to-red-500 text-white py-12 sm:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 sm:mb-6">Contact Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light">
              Crafting extraordinary moments through meticulously curated experiences that reveal the authentic soul
              of Sri Lanka
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Contact Section */}
          <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Info */}
              <div className="lg:col-span-4 border-2 p-4 sm:p-6 rounded-2xl bg-gray-50 border-white flex flex-col">
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Let's work together</h2>
                    <p className="text-gray-600">
                      Thank you for your interest in Ceylon Bucket. We're excited to hear from you.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Phone className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Call Us For Support</p>
                        <p className="font-semibold">+94 (77) 2158 315</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Mail className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email address</p>
                        <p className="font-semibold">demo@example.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <MapPin className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Visit Our Office</p>
                        <p className="font-semibold">123 Temple Road, Colombo 07, Sri Lanka</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 sm:mt-auto pt-6">
                  <a href="#" className="w-12 sm:w-14 h-12 sm:h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Facebook className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </a>
                  <a href="#" className="w-12 sm:w-14 h-12 sm:h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Twitter className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </a>
                  <a href="#" className="w-12 sm:w-14 h-12 sm:h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Youtube className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </a>
                  <a href="#" className="w-12 sm:w-14 h-12 sm:h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Instagram className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </a>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-8 border-2 p-4 sm:p-6 rounded-2xl bg-white">
                {submitStatus.message && (
                  <div className={`mb-6 p-4 rounded ${
                    submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name*"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address*"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <input
                      name="country"
                      type="text"
                      placeholder="Country*"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        errors.inquiryType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Inquiry types*</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                    </select>
                    {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>}
                  </div>

                  <div>
                    <textarea
                      placeholder="Type your message*"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 text-white px-6 sm:px-8 py-3 rounded-3xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="relative text-white">
          <div className="h-72 sm:h-96 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81636831517!2d79.82118597944535!3d6.921837390062624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1704997544696!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;