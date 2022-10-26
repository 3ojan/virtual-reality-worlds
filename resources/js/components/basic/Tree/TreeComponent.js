
import React, { useState } from 'react';
import styled from 'styled-components';
import Icons, { ICON_TYPES } from '../Icons';

const TreeComponentWrapper = styled.div`

`

const ButtonDiv = styled.div`
display: flex;
justify-content: space-between;
place-items: center;
padding: 24px;
border-top: 1px solid #C4C4C4;
gap: 16px;
&:hover{
  cursor: pointer;
  background-color: #F4F4F4;
}
`;

const ButtonTitle = styled.div`
font-size: 15px;
font-weight: 500;
line-height: 24px;
color: #1B1B1A;
flex-grow: 1;
`
const ButtonTitlePadding = styled.div`
font-size: 15px;
font-weight: 500;
line-height: 24px;
color: #1B1B1A;
flex-grow: 1;
padding-left:16px
`

const SingleButtonDiv = (title, type = ICON_TYPES.DOWN, onClick, id) => {
  return (
    <ButtonDiv onClick={onClick} key={id}>
      {/* <Icons type={type}></Icons> */}
      <ButtonTitlePadding>{title}</ButtonTitlePadding>
      <Icons type={type}></Icons>
    </ButtonDiv>
  )
}
const MultiButtonDiv = (title, expanded, onClick) => {
  const type = expanded ? ICON_TYPES.DOWN : ICON_TYPES.UP;
  return (
    <ButtonDiv onClick={onClick}>
      <Icons type={type}></Icons>
      <ButtonTitle>{title}</ButtonTitle>
      <Icons type={ICON_TYPES.DOWN}></Icons>
    </ButtonDiv>
  )
}

function TreeComponent(props) {
  const { items, title, iconType } = props;
  const [expanded, setexpanded] = useState(false);

  const data = {
    title: "Change Seat",
    items: [{ title: "Chair 1 ", type: ICON_TYPES.PREVIEW }, { title: "Chair 2 ", type: ICON_TYPES.PREVIEW }]
  }

  const onExpand = () => {
    setexpanded(!expanded)
  }

  return (
    <TreeComponentWrapper className='TreeComponentWrapper'>
      {MultiButtonDiv(title, expanded, onExpand)}
      {expanded && items.map((item, id) => {
        return SingleButtonDiv(item.title, item.type, onExpand, id)
      })}
    </TreeComponentWrapper>
  );
}

export default TreeComponent;