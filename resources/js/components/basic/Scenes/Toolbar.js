
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Header from '../Header';
import Icons, { ICONS_SIZE, ICON_TYPES } from '../Icons';
import SearchScene from '../Search/SearchScene';
import SceneMenuItem from './SceneMenuItem';

const ToolbarWrapper = styled.div`
height:100%;
width:56px;
position:absolute;
`
const StyledUI = styled.ul`
  display: flex;
  position: absolute;
  margin: 0;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  flex-direction: column;
  background-color: white;
  align-items: center;
  box-shadow: 2px 0px 16px rgba(0, 0, 0, 0.12);
  border-radius: 0px 2px 2px 0px;
  padding-left:0;
}
`
const StyledLI = styled.li`
display: flex;
position: relative;
padding: 8px;
margin: 8px;
cursor: pointer;
}
`
const ToolboxHolder = styled.div`
display: flex;
opacity: 1;
width: 360px;
height: 648px;
position: absolute;
justify-content: start;
left: 64px;
margin: 0;
top: 50%;
-ms-transform: translateY(-50%);
transform: translateY(-50%);
flex-direction: column;
background-color: white;
box-shadow: 2px 0px 16px rgba(0, 0, 0, 0.12);
border-radius: 0px 2px 2px 0px;
align-items: flex-start;
transition: opacity 1s;
z-index: 2;
`

const ULToolbox = styled.ul`
display: flex;
flex-direction: column;
width: 100%;
overflow-y: auto;
`
const LIToolbox = styled.li`
display: grid;
grid-template-columns: 42px 1fr auto;
padding: 12px;
height: 72px;
min-height: 72px;
border: none;
  border-top-color: currentcolor;
  border-top-style: none;
  border-top-width: medium;
border-radius: 0;
border-top: 1px solid rgba(196, 196, 196, 0.48);

span{
    text-align: left;
    margin-left: 12px;
  }
}
&:hover{
  cursor: pointer;
  background-color: #F4F4F4;
}
`

function ToolBar(props) {
  const { } = props;

  const onChange = (item) => {
    console.log(item, "changed")
  }
  const item = {
    id: 1,
    placeHolder: "Scene 1",
    description: "Objects num:2",
    onChange: (item) => { onChange(item) }
  }
  return (
    <ToolbarWrapper className='toolbar'>
      <StyledUI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
        <StyledLI>
          <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} />
        </StyledLI>
      </StyledUI>
      <ToolboxHolder>
        <Header title={"toolbox"}></Header>
        <SearchScene ></SearchScene>

        <ULToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
          <LIToolbox>
            <Icons type={ICON_TYPES.SEARCH} />
            <span>Some tool name</span>
          </LIToolbox>
        </ULToolbox>

      </ToolboxHolder>
    </ToolbarWrapper>
  );
}

export default ToolBar;