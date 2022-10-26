import React, { useState } from 'react';

const CheckBox = (props) => {
  const { checked, onChange } = props;

  const handleChange = (event) => {
    const checked = event.currentTarget.checked ? 1 : 0;
    onChange && onChange(checked);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked === 0 ? false : true}
          onChange={handleChange}
        />
        {props.label || ""}
      </label>
    </div>
  );
};

export default CheckBox;