import styled from 'styled-components';
import Spinner from '../../components/spinner';
import React, { useState, useEffect } from 'react';
import config from '../../config';
import GraphPanel from './graphPanel';


const FlexContainer = styled.div`
  display: grid;
  flex-wrap: wrap;
  margin: 5px 5px 5px 5px;
  align-items: center;
  justify-content: center;
`;
const Header = styled.h1`
  text-align: center;
  color: ${config.theme.primaryDark};
`;

interface SearchResultProps {
  loading: boolean;
  data: any;
}

export const SearchResults = (props: SearchResultProps) => {
  const { loading, data } = props;
  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
          <GraphPanel data={data} />
      )}
    </>
  );
};

export default SearchResults;
