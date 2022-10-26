
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { onChangeSceneData } from '../../../redux/world/world';
import CheckBox from '../Checkbox';
import OptionsMenu from '../OptionsMenu';
import ScenMenuItemImage from './ScenMenuItemImage';

const SceneMenuItemWrapper = styled.div`
position: relative;
height: 104px;
display: flex;
gap: 16px;
align-items: center;
transition: all 0.3s ease-in-out;
background-color: #FFF;
border-top: 1px solid #EBEBEA;
border-bottom: 1px solid #EBEBEA;
`
const StyledDraggableContent = styled.span`
  cursor: move;
  font-size: 18px !important;
  font-family: 'Material Icons Outlined';
font-weight: normal;
font-style: normal;
font-size: 24px;
line-height: 1;
letter-spacing: normal;
text-transform: none;
display: inline-block;
white-space: nowrap;
word-wrap: normal;
direction: ltr;
-moz-font-feature-settings: 'liga';
-moz-osx-font-smoothing: grayscale;
`

const RoomInfoWrapper = styled.span`
display: flex;
flex-direction: column;
gap: 4px;
flex-grow: 1;
flex-shrink: 1;
`

const InputRoomName = styled.input`
background: transparent;
border: none;
outline: none;
font-size: 15px;
font-weight: 500;
line-height: 24px;
columns: #1B1B1A;
width: 100%;
`
const InfoRoom = styled.div`
font-size: 12px;
font-weight: 400;
line-height: 16px;
`

const InfoInputComponent = (props) => {
  return <InputRoomName value={props.value} placeholder={props.placeholder} onChange={props.onChange}></ InputRoomName>
}




function SceneMenuItem(props) {
  const { onSceneSelect, selected, item, onChange, index } = props;

  const dispatch = useDispatch();

  const onTitleChanged = (event) => {
    const newItem = { ...item };
    newItem.publicName = event.target.value;
    dispatch(onChangeSceneData({ item: newItem, index }));

  }
  const onDropDownSelection = (selectedItem) => {
    console.log("onDropDwonSelection sceneMenu Item", selectedItem);
  }

  const menuOptionItems = [
    { id: 1, title: "Go to Scene" },
    { id: 2, title: "Set as Home" },
    { id: 3, title: "Duplicate" },
    { id: 4, title: "Delete" },
  ]

  console.log(selected)
  return (
    <SceneMenuItemWrapper>
      <StyledDraggableContent />
      <div>
        <OptionsMenu onClick={onDropDownSelection} items={menuOptionItems}></OptionsMenu>
      </div>
      <ScenMenuItemImage url={item.background.mediumPath} selected={selected} onClick={() => { onSceneSelect(item) }} isHome={index === 0} />
      <RoomInfoWrapper>
        <InfoInputComponent placeholder={item.publicName} value={item.publicName} onChange={onTitleChanged}></InfoInputComponent>
        <InfoRoom>{"Objects count : " + item.objects.length}</InfoRoom>
      </RoomInfoWrapper>
      <CheckBox></CheckBox>
    </SceneMenuItemWrapper>
  );
}

export default SceneMenuItem;