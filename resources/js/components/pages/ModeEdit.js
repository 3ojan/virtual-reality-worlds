import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSelectScene } from '../../redux/editMode/roomSettings';
import { loadWorldData } from '../../redux/world/world';
import NavbarEdit from '../basic/NavbarEdit';
import RoomGlobalSettingsMenu from '../basic/RoomGlobalSettingsMenu';
import ScenePicker from '../basic/Scenes/ScenePicker';
import ToolBar from '../basic/Scenes/Toolbar';
import SceneSettingsMenu from '../basic/SceneSettingsMenu';

function ModeEdit() {
  const dispatch = useDispatch();
  const { world } = useSelector(state => { return state });
  const { roomSettings } = useSelector(state => { return state });

  useEffect(() => {
    dispatch(loadWorldData(15))
  }, []);

  useEffect(() => {
    if (world.data) {
      console.log(world.data)
      console.log(world)
      if (!roomSettings.selectedScene) {
        dispatch(onSelectScene(world.data.data.scenes[0]))
      }
    }
  }, [world.data]);

  useEffect(() => {
    if (!roomSettings.selectedScene && world.data) {
      dispatch(onSelectScene(world.data.data.scenes[0]))
    }
  }, [roomSettings.selectedScene]);

  return (
    <div className="mode-edit">
      <NavbarEdit></NavbarEdit>
      {roomSettings.roomSettingsOpened && <RoomGlobalSettingsMenu></RoomGlobalSettingsMenu>}
      {roomSettings.sceneSettingsOpened && <SceneSettingsMenu></SceneSettingsMenu>}
      <ToolBar></ToolBar>
      <ScenePicker></ScenePicker>
    </div>
  );
}

export default ModeEdit;