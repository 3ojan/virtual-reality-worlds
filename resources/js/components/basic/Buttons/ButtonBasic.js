import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


const ButtonStyled = styled.button`
color: ${props => props.disabled ? "#C4C4C4" : "#6B9D11"};
background-color: white;
opacity: ${props => props.disabled ? "0.4" : "1"};
border:none;
padding: 8px 8px;
font-size: 15px;
font-weight: 500;
line-height: 24px;
height: 40px;
border-radius: 2px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`

const Button = (title, disabled) => {
  return <ButtonStyled type="button" disabled={disabled}>{title}</ButtonStyled>
}
function ButtonBasic(props) {
  const { title, disabled } = props;
  return (
    Button(title, disabled)
  );
}

export default ButtonBasic;