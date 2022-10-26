
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Icons, { ICON_TYPES } from '../Icons';


const SearchWrapper = styled.div`
display: flex;
place-items: center;
width:100%;
`
const StyledInput = styled.input`
width: 100%;
padding: 12px 56px 12px 16px;
border-radius: 2px;
border: 1px solid #C4C4C4;
color: #8D8D8B;
font-size: 15px;
font-weight: 400;
line-height: 24px;
outline-color: #8D8D8B;
`

const IconWrapper = styled.div`
position:absolute;
right:26px;
`

function SearchScene(props) {
  const { hideIcon, value, onChange } = props;
  return (
    <SearchWrapper>
      <StyledInput value={value} onChange={onChange}></StyledInput>
      <IconWrapper>
        {!hideIcon && <Icons type={ICON_TYPES.SEARCH} />}
      </IconWrapper>
    </SearchWrapper>
  );
}

export default SearchScene;