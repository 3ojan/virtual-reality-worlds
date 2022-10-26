import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';



export const ICONS_SIZE = {
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LAGRGE",
}
const sizes = {
  [ICONS_SIZE.SMALL]: "",
  [ICONS_SIZE.MEDIUM]: "20px",
  [ICONS_SIZE.LARGE]: "25px",
}

export const ICON_TYPES = {
  EXIT: "EXIT",
  CLOSE: "CLOSE",
  PREVIEW: "PREVIEW",
  SEARCH: "SEARCH",
  DOWN: "DOWN",
  UP: "UP",
  GEAR: "GEAR",
}
const classes = {
  [ICON_TYPES.EXIT]: "bi bi-box-arrow-left",
  [ICON_TYPES.CLOSE]: "bi bi-x-circle",
  [ICON_TYPES.PREVIEW]: "bi bi-eye",
  [ICON_TYPES.SEARCH]: "bi bi-search",
  [ICON_TYPES.DOWN]: "bi bi-caret-down",
  [ICON_TYPES.UP]: "bi bi-caret-down",
  [ICON_TYPES.GEAR]: "bi bi-gear",
}

const Disabled = styled.div`
cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
opacity:${props => props.disabled ? ".2" : ""};
`

const Container = (props) => {
  return <Disabled onClick={props.onClick} disabled={props.disabled} >
    {props.children}
  </Disabled >
}

function Icons(props) {
  const { type, onClick, size, disabled } = props;
  return (
    <Container onClick={onClick} disabled={disabled}>
      <i className={`${classes[type]}`} style={{ fontSize: sizes[size] }}></i>
    </Container>

  );
}

export default Icons;
