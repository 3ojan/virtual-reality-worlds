
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Icons, { ICON_TYPES } from '../Icons';
import ScenePickerItem, { Overlay } from './ScenePickerItem';
import { onSelectScene } from '../../../redux/editMode/roomSettings';

const ScenePickerWrapper = styled.div`
left: calc(50% - 208px);
position: fixed;
width: fit-content;
max-width: 626px;
height: 80px;
bottom: 32px;
border-radius: 4px;
border: 3px solid #FFF;
box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.16);
left: 50%;
transform: translateX(-50%);
display: flex;
padding: 8px;
background-color: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(4px);
gap: 12px;
align-items: center;
z-index: 1;
`

const SceneMenuWorldEdit = styled.div`
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
`
const SceneMenuWorldUpload = styled.div`
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
border: 1px dashed #8D8D8B;
`
const ScenesContainer = styled.div`
position: relative;
flex-wrap: nowrap;
display: flex;
gap: 12px;
height: 90px;
place-items: center;

`
const AllScenesWrapper = styled.div`
flex-grow: 1;
flex-shrink: 1;
overflow-x: hidden;
`
const Divider = styled.div`
height: 40px;
width: 1px;
background-color: #EBEBEA;
margin: 0 12px;
`

function ScenePicker(props) {
  const { } = props;
  const { roomSettings } = useSelector(state => { return state });
  const { editData } = useSelector(state => { return state.world });
  const scenes = editData ? editData.data.scenes : null;

  const dispatch = useDispatch();

  const onSceneClicked = (scene) => {
    dispatch(onSelectScene(scene));
  }
  return (
    <ScenePickerWrapper className='scenePicker'>
      <SceneMenuWorldEdit>
        <Icons type={ICON_TYPES.PREVIEW} />
        <Overlay><Icons type={ICON_TYPES.PREVIEW} /></Overlay>
      </SceneMenuWorldEdit>
      <SceneMenuWorldUpload>
        <Icons type={ICON_TYPES.PREVIEW} />
      </SceneMenuWorldUpload>
      <Divider></Divider>
      <AllScenesWrapper>
        <ScenesContainer className="scenesContainer">
          {roomSettings.selectedScene && scenes && scenes.map((scene, index) => {
            return <ScenePickerItem key={index} active={false} overlay={scene.id === roomSettings.selectedScene.id} onClick={() => { onSceneClicked(scene) }} url={scene.background.mediumPath} ></ScenePickerItem>
          })}
        </ScenesContainer>
      </AllScenesWrapper>
    </ScenePickerWrapper>
  );
}

export default ScenePicker;