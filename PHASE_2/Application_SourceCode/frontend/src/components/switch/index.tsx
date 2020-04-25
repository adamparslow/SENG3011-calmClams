import Switch from 'react-switch';
import React from 'react';
import styled from 'styled-components';
import config from '../../config';

const SwitchContainer = styled.div`
  display: grid;
  padding: 10px;
  color: ${config.theme.primaryLight};
  margin: auto;
  font-size: 12px;
  text-align: center;
`;

const Swtch = (props) => {
  return (
    <SwitchContainer>
      <Switch checked={props.checked} onChange={props.onChange} onColor={config.theme.mediumColor}/>
      {props.text}
    </SwitchContainer>
  );
};

export default Swtch;
