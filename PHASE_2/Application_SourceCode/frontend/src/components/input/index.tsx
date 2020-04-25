import React from 'react';
import styled from 'styled-components';
import config from '../../config'
import HelpButton from '../helpButton';
//import { TextField } from '@material-ui/core';
//TODO: Add typescript typing
//      Add Auto-Complete Option

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
`;

const TextField = styled.input`
  height: 25px;
  border-radius: "5px 5px 5px 5px";
  border: none;
  font-size: 18px;
  font-color: ${config.theme.primaryLight};
`

const ReactInput = (props) => {
  return (
    <InputContainer>
    <TextField
      onChange={props.onChange}
      className={`input ${props.className}`}
      placeholder = {props.placeholder}
    />
    {props.enableButton && <HelpButton toolTipMessage={props.toolTipMessage} toolTipTitle={props.toolTipTitle}></HelpButton>}
    </InputContainer>
  );
};

export default ReactInput;