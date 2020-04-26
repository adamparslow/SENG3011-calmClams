import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import config from '../../../config';
import { BsGraphUp, BsQuestionDiamond } from 'react-icons/bs';
import { GiEarthAmerica } from 'react-icons/gi';

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

interface tabType {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
}

const determineIcon = (tabName: String) => {
  if (tabName === 'Graph Page') {
    return (
      <StyledIcon>
        <BsGraphUp />
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
        <BsGraphUp />
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
