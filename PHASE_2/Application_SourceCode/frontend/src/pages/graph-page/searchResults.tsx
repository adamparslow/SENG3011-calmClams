import Spinner from '../../components/spinner';
import React from 'react';
import GraphPanel from './graphPanel';

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
