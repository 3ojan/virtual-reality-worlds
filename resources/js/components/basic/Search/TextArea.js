
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Icons, { ICON_TYPES } from '../Icons';


const SearchWrapper = styled.div`
display: flex;
place-items: center;
margin-bottom: 16px;
`
const StyledInput = styled.textarea`
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


function TextArea(props) {
  const { onChange } = props;
  return (
    <SearchWrapper>
      <StyledInput onChange={onChange}></StyledInput>
    </SearchWrapper>
  );
}

export default TextArea;