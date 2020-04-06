import styled from 'styled-components';
import Spinner from '../../components/spinner';
import React from 'react';
import SearchReport from './searchReport';
import config from '../../config'

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
      <Header>Reports:</Header>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        data.articles && 
        <FlexContainer>
            {data.articles.map((report) =>(
                <SearchReport article={report} key={report._id}/>
            ))}
        </FlexContainer>
      )}
    </>
  );
};

export default SearchResults;
