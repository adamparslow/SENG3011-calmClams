// Menu.js
import React, { useState, Dispatch, SetStateAction } from 'react';
import { StyledMenu } from './menu.styled';
import LogoImage from '../../../media/logo.png';
import styled from 'styled-components';
import Burger from '../burger';
import Tab from './tab';

const Logo = styled.img`
  width: 42px;
  position: fixed;
  top: 15px;
  left: 7px;
  z-index: 2;
`;
interface menuTypes {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  tabList: Array<String>;
}

const Menu = ({ tab, setTab, tabList }: menuTypes) => {
  const [open, setOpen] = useState(false);
  //Initialise Tabs

  return (
    <>
      <Burger open={open} setOpen={setOpen} />
      <Logo src={LogoImage} />
      <StyledMenu open={open}>
        {tabList.map((tabName, index) => (
          <Tab
            key={index}
            setTab={() => {
                setTab(index);
                setOpen(false);
            }}
            tabName={tabName}
            active={tab === index}
          />
        ))}
      </StyledMenu>
    </>
  );
};
export default Menu;
