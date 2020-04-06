// Menu.js
import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './menu.styled';
import LogoImage from '../../../media/logo.png';
import styled from 'styled-components';

const Logo = styled.img`
  width: 42px;
  position: fixed;
  top: 15px;
  left: 7px;
  z-index:2;
`;

const Menu = ({ open }) => {
  return (
    <>
    <Logo src={LogoImage} />
    <StyledMenu open={open}>
      
      Hello there :)
    </StyledMenu>
    </>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};
export default Menu;
