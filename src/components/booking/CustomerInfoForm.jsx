import React from 'react';

const CustomerInfoForm = ({ customerInfo, setCustomerInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="customer-info-form">
      <h3>Contact Information</h3>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={customerInfo.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={customerInfo.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <textarea
          name="address"
          placeholder="Address"
          value={customerInfo.address}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm; 