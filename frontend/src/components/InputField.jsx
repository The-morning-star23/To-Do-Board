import React from 'react';

const InputField = ({ label, type, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
      required
    />
  </div>
);

export default InputField;
