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
  const [expandable, setExpandable] = useState(
    data.articles.map((report) => ({ id: report._id, expanded: false })),
  );
  useEffect(() => {
    setExpandable(
      data.articles.map((report) => ({ id: report._id, expanded: false })),
    );
  }, [props.data]);

  const toggleReport = (id: string) => {
    const newState = expandable.map((report) => {
      console.log(report.id, id, report.id === id);
      if (report.id === id) {
        report.expanded = !report.expanded;
      }
      return report;
    });
    setExpandable(newState);
  };

  return (
    <>
      
     
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        data.articles && (
          <>
          <GraphPanel data={data} toggleReport={toggleReport} />
          </>
        )
      )}
    </>
  );
};

export default SearchResults;
