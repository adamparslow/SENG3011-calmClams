import PropagateLoader from 'react-spinners/MoonLoader';
import React from 'react';
import styled from 'styled-components';
import config from '../../config';

const SpinnerContainer = styled.div`
  position: absolute;
  padding-top: 20px;
  top: 50%;
  margin-left: -20px;
  left: 50%;
  z-index: 10;
`;
const GreyContainer = styled.div`
  position: absolute;
  height: 93vh;
  width: 100%;
  background-color: ${config.theme.primaryDark};
  opacity: 0.6;
  z-index: 1;
`;

const Spinner = (props) => {
  return (
    <>
      <GreyContainer />
      <SpinnerContainer>
        <PropagateLoader
          size={50}
          color={config.theme.lightColor}
          loading={props.loading}
        />
      </SpinnerContainer>
    </>
  );
};

export default Spinner;
