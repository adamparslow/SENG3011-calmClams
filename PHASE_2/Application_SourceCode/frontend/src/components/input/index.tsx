import React from 'react';
import styled from 'styled-components';
import config from '../../config'
//TODO: Add typescript typing
//      Add Auto-Complete Option

const InputContainer = styled.div`
  display: flex;
`;
const HelpButton = styled.button`
  width: 30px;
  background: ${config.theme.mediumColor};
  border-radius: 0px 5px 5px 0px;
  border: none;
  font-size: 18px;
  color: ${config.theme.primaryLight};
`;
const Input = styled.input`
  width: ${({ width }) => width ? `${width}px` : `100%`};
    height: 25px;
    border-radius: ${({enableButton}) => enableButton ? "5px 0px 0px 5px": "5px 5px 5px 5px"};
    border: none;
    font-size: 18px;
`

const ReactInput = (props) => {


  return (
    <InputContainer>
    <Input
      width={props.width}
      enableButton={props.enableButton}
      onChange={props.onChange}
      className={`input ${props.className}`}
      placeholder = {props.placeholder}
    />
    {props.enableButton && <HelpButton>?</HelpButton>}
    </InputContainer>
  );
};

export default ReactInput;