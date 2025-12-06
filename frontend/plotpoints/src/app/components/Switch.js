import React, { useId } from 'react';
import './Switch.css';

const Switch = ({ isOn, handleToggle }) => {
  const id = useId(); // generates a unique ID
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        style={{ background: isOn && '#99dfe8ff' }}
        className="react-switch-label"
        htmlFor={id}
      >
        <span className="react-switch-button" />
      </label>
    </>
  );
};

export default Switch;
