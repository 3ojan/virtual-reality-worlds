
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SceneMenuItem from './SceneMenuItem';

const ScenMenuItemImageWrapper = styled.div`
position: relative;
width: 72px;
height: 72px;
border-radius: 2px;
flex-shrink: 0;
flex-grow: 0;
border: ${props => !props.active ? "none" : "2px solid #6B9D11"};
`
const ImageWrapper = styled.div`
overflow: hidden;
border-radius: 2px;
width: 100%;
height: 100%;
`
const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
}
`
const SceneIndex = styled.div`
position: absolute;
width: 16px;
height: 16px;
left: -8px;
bottom: -8px;
display: grid;
place-items: center;
border-radius: 50%;
font-size: 10px;
font-weight: 600;
line-height: 12px;
color: #1B1B1A;
background-color: #C4C4C4;
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
visibility: ${props => props.visible ? "visible" : ""};
`
const HomeIcon = styled.span`
width:5px;
height:5px;
background:white;
`

const SceneIndexComponent = (props) => {
  return <SceneIndex>{props.id}</SceneIndex>
}



function ScenMenuItemImage(props) {
  const { url, selected, onClick, isHome } = props;
  return (
    <ScenMenuItemImageWrapper active={selected} onClick={onClick}>
      <ImageWrapper>
        <Img src={url} />
      </ImageWrapper>
      <SceneIndexComponent id={1} />
      {isHome && <HomeIndex className='homeIndex' visible={isHome} >
        <HomeIcon></HomeIcon>
      </HomeIndex>}
    </ScenMenuItemImageWrapper>
  );
}

export default ScenMenuItemImage;