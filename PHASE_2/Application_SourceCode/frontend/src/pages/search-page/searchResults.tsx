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
const Header = styled.div`
  top: 0;
  position: sticky;
  font-weight: bold;
  padding: 15px;
  font-size: 30px;
  text-align: center;
  color: ${config.theme.primaryLight};
  background-color: ${config.theme.mediumColor};
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
  // eslint-disable-next-line
  }, [props.data]);

  const toggleReport = (id: number) => {
    console.log(">>>1");
    console.log("expandable: ", expandable);
    const newState = expandable.map((report) => {
      console.log(">>>2");
      if (report.id === id) {
        console.log(">>>3");
        report.expanded = !report.expanded;
      }
      return report;
    });
    setExpandable(newState);
  };
  return (
    <>
      {loading && <Spinner loading={loading} />}
      <MapPanel loading={loading} data={data} toggleReport={toggleReport} />
      {data.articles.length === 0 || loading || (
        <>
          <Header>Reports:</Header>
          <FlexContainer>
            {data.articles.map((report, index) => (
              <SearchReport
                article={report}
                key={report._id}
                toggleReport={() => toggleReport(report._id)}
                expanded={expandable[index] && expandable[index].expanded}
              />
            ))}
          </FlexContainer>
        </>
      )}
    </>
  );
};

export default SearchResults;
