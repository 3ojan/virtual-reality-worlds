import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ButtonBasic from './Buttons/ButtonBasic';
import ButtonSecondary from "./Buttons/ButtonSecondary"
import Icons, { ICONS_SIZE, ICON_TYPES } from './Icons';

const NavbarHolder = styled.div`
  position: relative;
  background-color: #FFF;
  height: 64px;
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: center;
  box-shadow: 0 5px 8px #1b1b1a15;
  padding: 0 24px;
  user-select: none;
  z-index:42;
`
const NavbarLeftSide = styled.section`
display: flex;
align-items: center;
gap: 24px;
`
const NavbarMiddle = styled.section`
width: auto;
gap: 16px;
justify-self: center;
position: absolute;
`
const NavbarRightSide = styled.section`
justify-self: end;
min-width: 300px;
display: flex;
justify-content: end;
gap: 24px;
place-items: center;
height: 64px;
`
const TitleStyled = styled.div`
font-weight: 600;
font-size: 18px;
line-height: 24px;
`

const Title = (title) => <TitleStyled>{title}</TitleStyled>

function NavbarEdit() {
  return (
    <NavbarHolder>
      <NavbarLeftSide>
        <Icons type={ICON_TYPES.EXIT} size={ICONS_SIZE.MEDIUM}></Icons>
        {Title("Edit room")}
      </NavbarLeftSide>

      <NavbarMiddle>
        Text
      </NavbarMiddle>

      <NavbarRightSide>
        <ButtonBasic title="Preview"></ButtonBasic>
        <ButtonSecondary title="Publish"></ButtonSecondary>
        <Icons type={ICON_TYPES.PREVIEW} size={ICONS_SIZE.MEDIUM} ></Icons>
      </NavbarRightSide>
    </NavbarHolder >
  );
}

export default NavbarEdit;