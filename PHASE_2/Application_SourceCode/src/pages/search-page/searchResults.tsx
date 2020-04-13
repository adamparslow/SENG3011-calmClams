import styled from 'styled-components';
import Spinner from '../../components/spinner';
import React, { useState, useEffect } from 'react';
import SearchReport from './searchReport';
import config from '../../config';
import MapPanel from './mapPanel';

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
      if (report.id === id) {
        report.expanded = !report.expanded;
      }
      return report;
    });
    setExpandable(newState);
  };

  return (
    <>
      <MapPanel data={data} toggleReport={toggleReport} />
      <Header>Reports:</Header>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        data.articles && (
          <FlexContainer>
            {data.articles.map((report, index) => (
              <SearchReport
                article={report}
                key={report._id}
                toggleReport={() => toggleReport(report._id)}
                expanded={expandable[index].expanded}
              />
            ))}
          </FlexContainer>
        )
      )}
    </>
  );
};

export default SearchResults;
