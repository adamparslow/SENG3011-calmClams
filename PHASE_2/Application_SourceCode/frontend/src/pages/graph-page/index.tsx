import React, { useState } from 'react';
import SearchPanel from './searchPanel';
import SearchResults from './searchResults';
import styled from 'styled-components';
import config from '../../config';

const PageContainer = styled.div``;

interface GraphDataInterface {
  version: number,
  countries: Array<string>,
  graphData: Array<{}>
}

export const SearchPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [data, setData] = useState<GraphDataInterface>({
    version: 0,
    countries: ['global'],
    graphData: [generateChartData('global')]
  });

  const fetchData = async (
    tCases: boolean,
    tDeaths: boolean,
    nCases: boolean,
    nDeaths: boolean,
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>
  ) => {

    fetch('http://localhost:8080/get_data', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: "2020-02-01",
        end_date: "2020-04-01",
        countries: countries,
        disease: "covid19"
      })
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(json => {
        let newData: GraphDataInterface = {
          version: dataVersion,
          countries: json.countries,
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


    /*
    fetch(proxyurl)
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
    */
  };
  return (
    <PageContainer>
      <SearchPanel fetchData={fetchData} error={error} />
      <SearchResults loading={loading} data={data} />
    </PageContainer>
  );
};


// generate some random data, quite different range
function generateChartData(suffix) {
  let chartData = [] as any[];
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 100);
  firstDate.setHours(0, 0, 0, 0);

  let new_cases = 1600;
  let new_deaths = 5;
  let total_cases = 2900;
  let total_deaths = 8700;

  for (var i = 0; i < 15; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    let newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    new_cases += Math.round((Math.random() < 0.8 ? 1 : -1) * Math.random() * 10);
    new_deaths += Math.round((Math.random() < 0.8 ? 1 : -1) * Math.random() * 10);
    total_cases += Math.round((Math.random() < 0.85 ? 1 : -1) * Math.random() * 10);
    total_deaths += Math.round((Math.random() < 0.9 ? 1 : -1) * Math.random() * 10);

    let data = {};
    data["date_" + suffix] = newDate;
    data["new_cases_" + suffix] = new_cases;
    data["new_deaths_" + suffix] = new_deaths;
    data["total_cases_" + suffix] = total_cases;
    data["total_deaths_" + suffix] = total_deaths;
    chartData.push(data);
  }
  return chartData;
}

export default SearchPage;
