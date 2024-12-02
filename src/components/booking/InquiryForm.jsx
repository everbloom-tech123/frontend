import React from 'react';

const InquiryForm = ({ inquiryData, setInquiryData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border border-gray-300 
    focus:ring-2 focus:ring-red-500 focus:border-red-500 
    placeholder-gray-400 transition-all duration-200
    text-gray-900 text-base
    hover:border-red-300
  `;

  const labelClasses = `
    block text-sm font-medium text-gray-700 mb-1
  `;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="subject" className={labelClasses}>
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          placeholder="What would you like to know?"
          value={inquiryData.subject}
          onChange={handleChange}
          className={inputClasses}
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional: Add a subject for your inquiry
        </p>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Share your questions or special requests..."
          value={inquiryData.message}
          onChange={handleChange}
          rows="5"
          className={`${inputClasses} resize-none`}
        />
        <p className="mt-1 text-sm text-gray-500">
          Feel free to ask any questions or make special requests
        </p>
      </div>
    </div>
  );
};

export default InquiryForm;