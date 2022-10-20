import React, { useEffect, useRef, useState } from 'react';
import { ThreeJSValuesProvider } from '../../../context/thingsContext';
import { useDispatch, useSelector } from 'react-redux';
import { loadWorldData, cacheSavedData, saveWorldData } from '../../../redux/world/world';
import ViewGLClass from '../ViewGLClass';

export default function SingleWorldScene() {

  const dispatch = useDispatch();
  ///local state
  const [userState, setuserState] = useState(null);
  const { world } = useSelector(state => { return state });
  const { chat } = useSelector(state => { return state });
  const scene3DReference = React.useRef({})
  ////example of use
  // useEffect(() => {
  //   if (!userState) {
  //     dispatch(login({ "user-111": "a" }));
  //   }
  //   if (user != userState) {
  //     setuserState(user);
  //   }
  // }, [user]);
  const [worldData, setWorldData] = useState(null);
  const [dataToSave, setDataToSave] = useState(null);

  const loadWorldDataFromId = (id) => {
    axios.post('/get/worlds/getWorldData', { worldId: id }).then((response) => {
      const json = JSON.parse(response.data.data);
      setWorldData(json);
    })
  };

  const onUpdateWorldData = () => {
    dispatch(saveWorldData(14, world.dataForSave, world.data))
  }

  useEffect(() => {
    ///load world
    // loadWorldDataFromId(14);
    dispatch(loadWorldData(14))
  }, []);

  useEffect(() => {
    if (world.data) {
      setWorldData({ ...world.editData });
      scene3DReference.current.setWorldData(world.editData);
    }
  }, [world.data]);

  useEffect(() => {
    if (world.dataForSave) {
    }
  }, [world.dataForSave]);

  useEffect(() => {
    console.log(chat.worldChat)
  }, [chat.worldChat]);


  return (
    <>
      {/* <InfoContainer></InfoContainer> */}
      <ViewGLClass myRef={scene3DReference} onSave={(id, data) => { dispatch(cacheSavedData(data)) }}></ViewGLClass>
      <button onClick={onUpdateWorldData} >SAVE</button>
    </>
  );
}


