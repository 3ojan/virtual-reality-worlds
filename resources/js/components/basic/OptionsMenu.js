import React, { useState } from 'react';

const DropDownItem = (item, onClick) => {
  return <a key={item.id} className="dropdown-item" onClick={() => { onClick(item) }} >{item.title}</a>
}

const OptionsMenu = (props) => {
  const { onClick, item } = props;
  const [opened, setOpened] = useState(false);

  const handleChange = () => {
    setOpened(!opened);
  };

  return (
    <div>
      <div className="dropdown">
        <i className="bi bi-three-dots" onClick={handleChange} ></i>
        {opened && <div className="dropdown-menu show">
          {props.items.map(item => {
            return DropDownItem(item, onClick)
          })}
        </div>}
      </div>
    </div>
  );
};

export default OptionsMenu;