import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import config from '../../../config';
import { GiEarthAmerica } from 'react-icons/gi';
import EbolaImage from '../../../media/ebola.png';
import CovidImage from '../../../media/covid.png';

const StyledTab = styled.div`
  color: ${config.theme.primaryLight};
  background-color: ${({ active }) =>
    active ? config.theme.mediumColor : config.theme.darkColor};
  padding: 20px;
  font-size: 20px;
  text-align: center;
  padding-right: 55px;
`;
const StyledIcon = styled.span`
  position: absolute;
  right: 18px;
`;

const Logo = styled.img`
  width: 32px;
  position: absolute;
  left: -26px;
`;

interface tabType {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
}

const determineIcon = (tabName: String) => {
  if (tabName === 'Ebola Graph') {
    return (
      <StyledIcon>
        <Logo src={EbolaImage} />
      </StyledIcon>
    );
  }
  if (tabName === 'World Map') {
    return (
      <StyledIcon>
        <GiEarthAmerica />
      </StyledIcon>
    );
  } else {
    return (
      <StyledIcon>
        <Logo src={CovidImage} />
      </StyledIcon>
    );
  }
};

const Tab = ({ setTab, tabName, active}) => {
  const Icon = determineIcon(tabName);
  return (
    <StyledTab active={active} onClick={setTab}>
      {tabName}
      {Icon}
    </StyledTab>
  );
};

export default Tab;
