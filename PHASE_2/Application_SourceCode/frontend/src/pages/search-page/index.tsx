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
    const fsSearchquery = `${config.flyingSplaucersApiRoute}?${searchquery}`;
    const geocodingUrl = `https://api.geocod.io/v1.4/geocode?api_key=${config.geocodioKey}&limit=1`
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
      .then(async ([ourResponse, fsResponse]) => {
        const data = ourResponse;

        let id = data.articles[data.articles.length - 1]._id + 1;

        let locationData : any[] = [];
        for (const article of fsResponse) {
          id++;
          article._id = id;

          let locations = article.reports[0].locations;
          locations = locations.filter(location => location.location && location.country) 
          locations = locations.map(location => `${location.location},${location.country}`);

          if (locations.length === 0) {
            continue;
          }

          locationData.push({
            article: article,
            locations: locations
          });
        }

        const promises = locationData.map(({article, locations}) => {
          return fetch(geocodingUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(locations)
          })
            .then(response => response.json())
            .then(data => {
              const newLocations: any[] = [];
              for (const result of data.results) {
                if (result.response.results && result.response.results.length !== 0) {
                  const locationData = result.response.results[0].location;
                  const coords = `${locationData.lat}, ${locationData.lng}`;

                  newLocations.push({ 
                    'coords': coords
                  });
                }
              }

              article.reports[0].locations = newLocations;
            });
        });

        await Promise.all(promises);

        data.articles.push(...fsResponse);
        console.log(fsResponse);
        // data.articles = fsResponse;
        data.version = dataVersion;
        setData(data);
        setDataVersion(dataVersion + 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        console.error(err);
        setLoading(false);
        showModal("That query returned no results");
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

const showModal = (error) => {
  var modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
  var modalContents = modals[0].getElementsByClassName('modal-content') as HTMLCollectionOf<HTMLElement>;
  modalContents[0].getElementsByTagName('p')[0].textContent = error;
  modals[0].style.display = 'block';
}

export default SearchPage;
