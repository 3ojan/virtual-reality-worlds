import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ViewGL from './ViewGL';
import { setRadius } from '../../redux/user/sphere';
import { loadWorldData } from '../../redux/world/world';
import { ThreeJSValuesProvider } from '../../context/thingsContext';
import ViewGLClass from './ViewGLClass';

let viewGL;
export default function Scene() {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { sphere } = useSelector(state => { return state });
  const { world } = useSelector(state => { return state });

  ///local state
  const [userState, setuserState] = useState(null);
  const [worldState, setWorldState] = useState(null);

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

  const viewGlRef = React.useRef();
  const [stateSphere, setStateSphere] = useState(sphere);

  useEffect(() => {
    setStateSphere(sphere);
    ///load world
    dispatch(loadWorldData())
    if (!world.data) {
    }
  }, []);

  useEffect(() => {
    setWorldState(world.data);
    scene3DReference.current.setWorldData(world.data);


  }, [world.data]);

  useEffect(() => {
    setStateSphere(sphere);
  }, [sphere]);

  return (
    <>
      <ThreeJSValuesProvider value={stateSphere}>
        <div ref={viewGlRef}>
          {/* {<ViewGL ></ViewGL>} */}
        </div>
      </ThreeJSValuesProvider>
      {/* <InfoContainer></InfoContainer> */}
      <ViewGLClass myRef={scene3DReference}></ViewGLClass>
    </>
  );
}


