import React from 'react';
import '../styles/inputField.css';

const InputField = ({ label, type, name, value, onChange }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input-field"
      required
    />
  </div>
);

export default InputField;
