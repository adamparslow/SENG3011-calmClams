import React from 'react';
import styled from 'styled-components';
//TODO: Add typescript typing
const Input = styled.input`
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
  height: 30px;
  border-radius: ${({ enableButton }) =>
    enableButton ? '5px 0px 0px 5px' : '5px 5px 5px 5px'};
  border: none;
  font-size: 18px;
`;
const DateInput = (props) => {
  return (
    <Input
      width={props.width}
      enableButton={props.enableButton}
      type={'date'}
      onChange={props.onChange}
      className={`date-input ${props.className}`}
      placeholder={props.placeholder}
    />
  );
};

export default DateInput;
