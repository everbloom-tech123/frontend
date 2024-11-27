import React from 'react';

const InquiryForm = ({ inquiryData, setInquiryData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="inquiry-form">
      <h3>Questions & Special Requests</h3>
      <div className="form-group">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={inquiryData.subject}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <textarea
          name="message"
          placeholder="Your message, questions, or special requests..."
          value={inquiryData.message}
          onChange={handleChange}
          rows="5"
        />
      </div>
    </div>
  );
};

export default InquiryForm; 