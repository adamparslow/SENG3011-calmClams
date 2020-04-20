import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import config from '../../../config'

const StyledTab = styled.div`

`;

interface tabType {
    tab: number, 
    setTab: Dispatch<SetStateAction<number>>
  }


const Tab = ({tab, setTab}) => {
  return (
    <StyledTab
      onClick={setTab(tab)}
    >
        THIS IS A TAB
      {/* <span>{props.children}</span> */}
    </StyledTab>
  );
};

export default Tab;
