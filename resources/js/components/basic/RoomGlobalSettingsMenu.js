
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { onActiveTabChange } from '../../redux/editMode/roomSettings';
import ButtonSecondary from './Buttons/ButtonSecondary';
import CheckBox from './Checkbox';
import Icons, { ICONS_SIZE, ICON_TYPES } from './Icons';
import ImageUpload from './ImageUpload';
import { MenuTitle } from './scene.styled';
import SceneMenu from './Scenes/SceneMenu';
import SearchScene from './Search/SearchScene';
import TextArea from './Search/TextArea';
import Tabs from './Tabs/Tabs';


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


function RoomGlobalSettingsMenu(props) {
  const dispatch = useDispatch();
  const { editData } = useSelector(state => { return state.world });
  const { activeTab } = useSelector(state => { return state.roomSettings });
  const [loadedData, setLoadedData] = useState(null);
  const [state, setState] = useState({
    sceneEditor: null
  });

  useEffect(() => {
    if (editData) {
      setLoadedData(editData)
    }
  }, [editData]);

  ///tabs change
  const onTabClick = () => {
    dispatch(onActiveTabChange(activeTab))
  }

  //change data ti save 
  const onChangeData = (prop, value) => {
    const newState = { ...loadedData };
    newState[prop] = value
    setLoadedData(newState);
  }


  return (
    loadedData ? (
      <RoomSceneMenuWrapper>
        <MenuTitle>ROOM SETTINGS</MenuTitle>
        <ItemWrapper>
          <NameHolder>
            {InputTitle(loadedData.name)}
            <Icons type={ICON_TYPES.CLOSE} size={ICONS_SIZE.MEDIUM}></Icons>
          </NameHolder>
        </ItemWrapper>
        <ItemWrapper>
          <Tabs buttons={[{ id: 1, title: "General", active: activeTab === "general" }, { id: 2, title: "Scene", active: activeTab === "scene" }]} onClick={onTabClick}></Tabs>
        </ItemWrapper>
        {activeTab === "scene" &&
          (<div>
            <ItemWrapper>
              <SearchScene></SearchScene>
            </ItemWrapper>
            <ItemWrapper>
              <SceneMenu scenesData={loadedData.data.scenes}></SceneMenu>
            </ItemWrapper>
          </div>)
        }
        {activeTab === "general" &&
          (<div>
            <ItemWrapper>
              <SceneRoomTitle title="Room name"></SceneRoomTitle>
              <SearchScene hideIcon={true} value={loadedData.name} onChange={(e) => { onChangeData("name", e.target.value) }}></SearchScene>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Public available")}
                <CheckBox checked={loadedData.publicAvailable} onChange={(bool) => { onChangeData("publicAvailable", bool) }}></CheckBox>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Locked for editing")}
                <CheckBox checked={loadedData.lockedForEditing} onChange={(bool) => { onChangeData("lockedForEditing", bool) }}></CheckBox>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Welcome Screen")}
                <CheckBox></CheckBox>
                <ButtonSecondary title="Edit"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <SceneRoomTitle title="Preview Image"></SceneRoomTitle>
              <ImageUpload onImageUpload={(response) => { console.log(response) }}></ImageUpload>
            </ItemWrapper>

            <ItemWrapper>
              <SceneRoomTitle title="Description"></SceneRoomTitle>
              <TextArea value={loadedData.description} onChange={(e) => { onChangeData("description", e.target.value) }}></TextArea>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Room Coordinates")}
                <ButtonSecondary title="Set"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>

            <ItemWrapper>
              <NameHolder>
                {InputTitle("Room Contributores")}
                <ButtonSecondary title="Edit"></ButtonSecondary>
              </NameHolder>
            </ItemWrapper>
          </div>)
        }
      </RoomSceneMenuWrapper >) : <></>

  );
}

export default RoomGlobalSettingsMenu;