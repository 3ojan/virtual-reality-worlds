
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { onSelectScene, onOpenSceneSettings } from '../../../redux/editMode/roomSettings';
import SceneMenuItem from './SceneMenuItem';

const SceneMenuWrapper = styled.div`
flex-grow: 1;
flex-shrink: 1;
display: block;
`



function SceneMenu(props) {
  const { scenesData, onSceneChange } = props;

  const dispatch = useDispatch();

  const { roomSettings } = useSelector(state => { return state });
  const { editData } = useSelector(state => { return state.world });
  const [selectedScene, setSelectedScene] = useState(null);


  useEffect(() => {
    if (roomSettings.selectedScene) {
      setSelectedScene(roomSettings.selectedScene)
    } else {
      dispatch(onSelectScene(editData.data.scenes[0]))
    }
  }, [roomSettings.selectedScene]);


  const onSceneClicked = (scene, index) => {
    dispatch(onSelectScene(scene));
    dispatch(onOpenSceneSettings());
  }

  return (
    <SceneMenuWrapper>
      {selectedScene && scenesData.map((scene, index) => <SceneMenuItem key={index} item={scene} selected={scene.id === selectedScene.id} onSceneSelect={(scene) => { onSceneClicked(scene, index) }} index={index}></SceneMenuItem>)}
    </SceneMenuWrapper>
  );
}

export default SceneMenu;