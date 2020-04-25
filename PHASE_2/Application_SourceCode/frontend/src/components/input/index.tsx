import React from 'react';
import styled from 'styled-components';
import config from '../../config'
//import { TextField } from '@material-ui/core';
//TODO: Add typescript typing
//      Add Auto-Complete Option

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
`;
const HelpButton = styled.button`
  width: 30px;
  background: ${config.theme.mediumColor};
  border-radius: 0px 5px 5px 0px;
  border: none;
  font-size: 18px;
  color: ${config.theme.primaryLight};
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
    {props.enableButton && <HelpButton>?</HelpButton>}
    </InputContainer>
  );
};

export default ReactInput;