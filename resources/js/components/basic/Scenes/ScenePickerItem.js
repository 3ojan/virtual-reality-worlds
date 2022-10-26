
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Icons, { ICONS_SIZE, ICON_TYPES } from '../Icons';

const ScenePickerWrapper = styled.div`

`
const ScenePickerItemImgWrapper = styled.div`
position: relative;
width: 56px;
height: 56px;
display: grid;
place-items: center;
background-color: #FFF;
box-shadow: 0 2px 8px #1b1b1a15;
border-radius: 2px;
cursor: pointer;
flex-grow: 0;
flex-shrink: 0;
  border: ${props => !props.active ? "none" : "2px solid #6B9D11"};
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
`
const HomeIndex = styled.div`
position: absolute;
width: 18px;
height: 18px;
border-radius: 50%;
background-color: #6B9D11;
left: 50%;
top: -9px;
transform: translateX(-50%);
display: grid;
place-items: center;
visibility: ${props => props.active ? "visible" : ""};
`
export const Overlay = styled.div`
display: grid;
place-items: center;
background-color: #6B9D11;
position: absolute;
width: 32px;
height: 32px;
bottom: 0;
right: 0;
border-radius: 12px 0 0 0;
i {
  color:white;
}
`


function ScenePickerItem(props) {
  const { active, overlay, onClick, url } = props;

  return (
    <ScenePickerWrapper className='scenePickerItem' onClick={onClick}>
      <ScenePickerItemImgWrapper active={overlay}>
        <img src={url || "public/image/202210111205f59622912.jpg"} />
        {active && <HomeIndex active={active}></HomeIndex>}
        {overlay && <Overlay >
          <Icons type={ICON_TYPES.GEAR} size={ICONS_SIZE.LARGE} />
        </Overlay>}
      </ScenePickerItemImgWrapper>
    </ScenePickerWrapper>
  );
}

export default ScenePickerItem;