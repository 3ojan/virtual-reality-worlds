
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { onOpenRoomSettings } from '../../redux/editMode/roomSettings';
import { onChangeSelectedSceneData } from '../../redux/world/world';
import ButtonSecondary from './Buttons/ButtonSecondary';
import CheckBox from './Checkbox';
import Icons, { ICONS_SIZE, ICON_TYPES } from './Icons';
import ImageUpload, { StyledImageWrapper } from './ImageUpload';
import { MenuTitle } from './scene.styled';
import ElementsTreeViewer from './Scenes/ElementsTreeViewer';
import SearchScene from './Search/SearchScene';
import Tabs from './Tabs/Tabs';
import TreeComponent from './Tree/TreeComponent';


const RoomSceneMenuWrapper = styled.div`
position: fixed;
height: calc(100% - 64px);
right: 0;
bottom: 0;
z-index: 32;
width: min(416px, 100%);
background-color: #FFF;
// display: none;
flex-direction: column;
padding: 24px 0 0 0;
gap: 16px;
box-shadow: 0 2px 16px #1b1b1a15;
`
const NameHolder = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
`
const StyledInputTItle = styled.div`
font-weight: 600;
font-size: 18px;
line-height: 24px;
pointer-events: none;
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: #1B1B1A;
border: none;
flex-grow: 1;
flex-shrink: 1;
`
const ItemWrapper = styled.div`
padding:8px 16px;
`

const StyledTitle = styled.div`
padding:8px 0px;
`

const SceneRoomTitle = (props) => {
  return <StyledTitle>{props.title}</StyledTitle>
}

const InputTitle = (title) => {
  return <StyledInputTItle>{title}</StyledInputTItle>
}

function SceneSettingsMenu(props) {

  const [activeTab, setactiveTab] = useState(true);
  const [imageReplaces, setImageReplaces] = useState(false);


  const dispatch = useDispatch();
  const { roomSettings } = useSelector(state => { return state });
  const { editData, scenes } = useSelector(state => { return state.world });


  const onTabClick = () => {
    setactiveTab(!activeTab)
  }

  //change data ti save 
  const onImageReplaced = (response) => {
    debugger;
    const id = roomSettings.selectedScene.id;
    const data = { background: { ...scenes[id].background } };
    data.background.mediumPath = response.path;

    dispatch(onChangeSelectedSceneData({ id, data }));
    setImageReplaces(true);
  }
  const onChangeData = (prop, value) => {
    const id = roomSettings.selectedScene.id;
    const data = {
      [prop]: value
    }
    console.log(id, data, prop)
    dispatch(onChangeSelectedSceneData({ id, data }));
  }
  let id = roomSettings.selectedScene ? roomSettings.selectedScene.id : null;
  const data = scenes[id];
  return (
    roomSettings.selectedScene ?
      (<RoomSceneMenuWrapper>
        <MenuTitle>SCENE SETTINGS</MenuTitle>
        <ItemWrapper>
          <NameHolder>
            {InputTitle(scenes[id].name)}
            <Icons type={ICON_TYPES.CLOSE} size={ICONS_SIZE.MEDIUM} onClick={() => { dispatch(onOpenRoomSettings()) }}></Icons>
          </NameHolder>
        </ItemWrapper>
        <ItemWrapper>
          <Tabs buttons={[{ id: 1, title: "General", active: activeTab }, { id: 2, title: "Elements", active: !activeTab }]} onClick={onTabClick}></Tabs>
        </ItemWrapper>
        {
          !activeTab &&
          (<div>
            <ItemWrapper>
              <ElementsTreeViewer sceneObjects={roomSettings.selectedScene.objects}></ElementsTreeViewer>
            </ItemWrapper>
          </div>)
        }
        {
          activeTab &&
          (<div>
            <ItemWrapper>
              <SceneRoomTitle title="Room name"></SceneRoomTitle>
              <SearchScene hideIcon={true} value={scenes[id].name} onChange={(e) => { onChangeData("name", e.target.value) }}></SearchScene>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Home Scene")}
                <ButtonSecondary title="Set as Home"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Lockable")}
                <CheckBox checked={data.lockedForEditing} onChange={(bool) => { onChangeData("lockable", bool) }}></CheckBox>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Public")}
                <CheckBox checked={data.publicStage} onChange={(bool) => { onChangeData("publicStage", bool) }}></CheckBox>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Paid location")}
                <CheckBox checked={data.paidStage} onChange={(bool) => { onChangeData("paidStage", bool) }}></CheckBox>
              </NameHolder>
            </ItemWrapper>
            <ItemWrapper>
              <NameHolder>
                {InputTitle("Ambient Music")}
                <CheckBox></CheckBox>
                <ButtonSecondary title="Upload"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <SceneRoomTitle title="Scene Image"></SceneRoomTitle>
              <StyledImageWrapper>
                {!imageReplaces && <img src={data.background.mediumPath} />}
              </StyledImageWrapper>
              <ImageUpload onImageUpload={(response) => { onImageReplaced(response) }}></ImageUpload>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                <ButtonSecondary title="Duplicate"></ButtonSecondary>
                <ButtonSecondary title="Delete"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>
          </div>)
        }
      </RoomSceneMenuWrapper >) : <></>

  );
}

export default SceneSettingsMenu;