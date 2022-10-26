
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


const TabWrapper = styled.div`
display: flex;
`
const TabbedButtonInactive = styled.div`
  height: 40px;
  flex-grow: 1;
  flex-shrink: 1;
  background-color: #EBEBEA;
  color: #1B1B1A;
  border: 2px solid #EBEBEA;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  display: grid;
  place-items: center;
  cursor: pointer;
  text-transform: capitalize;
}
`
const TabbedButtonActive = styled.div`
background-color: #FFF;
font-size: 15px;
font-weight: 600;
line-height: 22px;
height: 40px;
flex-grow: 1;
flex-shrink: 1;
color: #1B1B1A;
border: 2px solid #EBEBEA;
font-weight: 400;
display: grid;
place-items: center;
cursor: pointer;
text-transform: capitalize;
}
`



const TabbedButton = (props) => {
  return props.active ? <TabbedButtonActive key={props.id} onClick={props.onClick}>{props.title}</TabbedButtonActive> : <TabbedButtonInactive onClick={props.onClick}>{props.title}</TabbedButtonInactive>
}


function Tabs(props) {
  const { buttons, onClick } = props;
  return (
    <TabWrapper>
      {buttons.map(item => {
        return <TabbedButton key={item.id} active={item.active} onClick={onClick} title={item.title}></TabbedButton>
      })}
    </TabWrapper>
  );
}

export default Tabs;