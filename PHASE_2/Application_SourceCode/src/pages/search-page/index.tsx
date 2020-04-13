import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import SearchResults from './searchResults';
import MapPanel from './mapPanel';
import styled from 'styled-components';
import config from '../../config';

const PageContainer = styled.div``;

export const SearchPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

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
        setData(response);
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
      <MapPanel data={data}/>
      <SearchResults loading={loading} data={data} />
    </PageContainer>
  );
};

export default SearchPage;
