import React from 'react';
import styled from 'styled-components';
import config from '../../config'
import HelpButton from '../helpButton';
//TODO: Add typescript typing
//      Add Auto-Complete Option

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
`;
const Input = styled.input`
  width: ${({ width }) => width ? `${width}px` : `100%`};
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
    {props.enableButton && <HelpButton toolTipMessage={props.toolTipMessage} toolTipTitle={props.toolTipTitle}></HelpButton>}
    </InputContainer>
  );
};

export default ReactInput;