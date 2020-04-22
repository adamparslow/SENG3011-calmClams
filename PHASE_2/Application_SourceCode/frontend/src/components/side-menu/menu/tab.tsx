import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import config from '../../../config';

const StyledTab = styled.div`
  color: ${config.theme.primaryLight};
  background-color: ${({ active }) =>
    active ? config.theme.mediumColor : config.theme.darkColor};
  padding: 20px;
  font-size: 20px;
  text-align: center;
`;

interface tabType {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
}

const Tab = ({ tab, setTab, tabName, active, open }) => {
  return (
    <StyledTab active={active} onClick={() => open && setTab(tab)}>
      {tabName}
    </StyledTab>
  );
};

export default Tab;
