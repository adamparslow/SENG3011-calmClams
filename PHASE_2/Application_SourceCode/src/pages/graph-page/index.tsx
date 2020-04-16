import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import SearchResults from './searchResults';
import styled from 'styled-components';
import config from '../../config';

const PageContainer = styled.div``;

export const SearchPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [data, setData] = useState({articles: [], version: -1});

  const fetchData = async (
    searchquery: string
  ) => {
    //Heroku to bypass CORS like a real hacker :D
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    searchquery = `${config.apiRoute}?${searchquery}`;
    fetch(proxyurl + searchquery)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        response.version = dataVersion;
        setData(response);
        setDataVersion(dataVersion + 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
    setLoading(true);
  };
  return (
    <PageContainer>
      <SearchPanel fetchData={fetchData} error={error} />
      <SearchResults loading={loading} data={data} />
    </PageContainer>
  );
};

export default SearchPage;
