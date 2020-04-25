import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import SearchResults from './searchResults';
import styled from 'styled-components';

const PageContainer = styled.div``;

interface GraphDataInterface {
  version: number,
  countries: Array<string>,
  graphData: Array<{}>
}

export const SearchPage = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);
  const [data, setData] = useState<GraphDataInterface>({
    version: 0,
    countries: [],
    graphData: [{}]
  });

  const fetchData = async (
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>
  ) => {
    
    setFirstLoad(false);
    fetch('http://localhost:8080/get_data', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: "2020-01-01",
        end_date: "2020-04-23",
        countries: countries,
        google: google,
        disease: "covid19"
      })
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(json => {
        console.log(json);
        let newData: GraphDataInterface = {
          version: dataVersion,
          countries: json.seriesTitles,
          graphData: json.graphData
        };
        setData(newData);
        setDataVersion(dataVersion + 1);
        setLoading(false);
      })
      .catch(error => {
        setError(true);
        console.log(error);
      });
    setLoading(true);
  };
  return (
    <PageContainer>
      <SearchPanel fetchData={fetchData} error={error} firstLoad={firstLoad}/>
      <SearchResults loading={loading} data={data} />
    </PageContainer>
  );
};
export default SearchPage;
