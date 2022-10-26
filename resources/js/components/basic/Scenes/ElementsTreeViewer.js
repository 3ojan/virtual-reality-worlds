
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { elementNames } from '../../Threejs/engine/helpers/scene';
import Icons, { ICON_TYPES } from '../Icons';
import TreeComponent from '../Tree/TreeComponent';

const ElementsTreeViewerWrapper = styled.div`

`



function ElementsTreeViewer(props) {
  const { sceneObjects } = props;

  const [sceneObjectsState, setSceneObjectsState] = useState(null);
  useEffect(() => {
    const data = {};
    sceneObjects.map(item => {
      if (!data[item.type]) {
        data[item.type] = {};
        data[item.type].items = [];
        data[item.type].title = elementNames(item.type);
      }
      data[item.type].items.push({
        title: item.name,
        type: ICON_TYPES.PREVIEW
      });
    })
    setSceneObjectsState(data)
  }, [])


  return (
    <ElementsTreeViewerWrapper className="ElementsTreeViewerWrapper">
      {sceneObjectsState && Object.keys(sceneObjectsState).map((key, index) => {
        return <TreeComponent key={index} title={sceneObjectsState[key].title} items={sceneObjectsState[key].items} />
      })}
      {/*  <TreeComponent title={_data.changeSeat.title} items={_data.changeSeat.items} />
       <TreeComponent title={_data.baglessRoom.title} items={_data.baglessRoom.items} />
       <TreeComponent title={_data.sceneChange.title} items={_data.sceneChange.items} /> */}
    </ElementsTreeViewerWrapper>
  );
}

export default ElementsTreeViewer;