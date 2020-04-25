import Spinner from '../../components/spinner';
import React from 'react';
import GraphPanel from './graphPanel';
import Switch from '../../components/switch';
import styled from 'styled-components';

interface SearchResultProps {
  loading: boolean;
  data: any;
}

const ChartContainer = styled.div``;

export const SearchResults = (props: SearchResultProps) => {
  const { loading, data } = props;
  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
          <ChartContainer>
            <GraphPanel data={data} />
            <div margin-top={"-80px"}><Switch onChange={()=>{}}/></div>
          </ChartContainer>
        )}
    </>
  );
};

export default SearchResults;
