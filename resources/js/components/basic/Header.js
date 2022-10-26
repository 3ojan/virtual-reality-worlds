
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Icons, { ICON_TYPES } from './Icons';

const ToolbarWrapper = styled.div`
padding: 24px;
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
`
const HeaderTitle = styled.div`
font-weight: 600;
font-size: 18px;
line-height: 24px;
`

function Header(props) {
  const { title } = props;

  return (
    <ToolbarWrapper className='header'>
      <HeaderTitle>
        {title}
      </HeaderTitle>
      <Icons type={ICON_TYPES.CLOSE} />
    </ToolbarWrapper>
  );
}

export default Header;