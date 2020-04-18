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
    const ourSearchquery = `${config.ourApiRoute}?${searchquery}`;
    console.log(searchquery);
    const fsSearchquery = `${config.flyingSplaucersApiRoute}?${searchquery}`;
    Promise.all([
      fetch(proxyurl + ourSearchquery)
        .then((response) => {
          return response.json();
        }),
      fetch(proxyurl + fsSearchquery)
        .then((response) => {
          return response.json();
        })
    ])
      .then(([ourResponse, fsResponse]) => {
        const data = ourResponse;
        data.articles.push(...fsResponse);
        data.version = dataVersion;
        setData(data);
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
