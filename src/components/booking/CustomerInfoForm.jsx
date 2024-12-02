import React from 'react';

const CustomerInfoForm = ({ customerInfo, setCustomerInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
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
        <label htmlFor="name" className={labelClasses}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={customerInfo.name}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={customerInfo.phone}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="address" className={labelClasses}>
          Address
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Enter your full address"
          value={customerInfo.address}
          onChange={handleChange}
          rows="3"
          className={`${inputClasses} resize-none`}
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Please provide your complete address for booking confirmation
        </p>
      </div>
    </div>
  );
};

export default CustomerInfoForm;