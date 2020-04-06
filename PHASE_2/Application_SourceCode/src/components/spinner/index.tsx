import PropagateLoader from 'react-spinners/PropagateLoader';
import React from 'react';
import styled from 'styled-components';
import config from '../../config';

const SpinnerContainer = styled.div`
  position: relative;
  padding-top: 20px;
  top: 50%;
  margin-left: -20px;
  left: 50%;
`;

const Spinner = (props) => {
  return (
    <SpinnerContainer>
      <PropagateLoader size={30} color={config.theme.darkColor} loading={props.loading} />
    </SpinnerContainer>
  );
};

export default Spinner;
