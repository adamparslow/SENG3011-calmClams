import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Input from '../../components/input';
import config from '../../config';
import Switch from '../../components/switch';
import { Grid } from '@amcharts/amcharts4/charts';

const FlexContainer = styled.div`
  display: flex;
  background: ${config.theme.darkColor};
  align-items: center;
  
`;
const GridContainer = styled.div`
  display: grid;
  padding: 10px;
  color: ${config.theme.primaryLight};
  margin: auto;
  font-size: 12px;
  text-align: center;
`;

interface SearchPanelProps {
  fetchData: (
    tCases: boolean,
    tDeaths: boolean,
    nCases: boolean,
    nDeaths: boolean,
    google: Array<string>,
    twitter: Array<string>,
    countries: Array<string>
  ) => void;
  error: boolean;
}

export const SearchPanel = (props: SearchPanelProps) => {
  const [googleTerms, setGoogleTerms] = useState('');
  const [twitterTags, setTwitterTags] = useState('');
  const [countries, setCountries] = useState('');
  const handleSwitch = (event) => {
    console.log(event);
  };
  const handleGoogleTerms = (event) => {
    setGoogleTerms(event.target.value);
  };
  const handleTwitterTags = (event) => {
    setTwitterTags(event.target.value);
  };
  const handleCountry = (event) => {
    setCountries(event.target.value);
  };
  const santitisedDataFetch = () => {
    return props.fetchData(true, false, false, false, googleTerms == "" ? []:googleTerms.split(","), [], countries == "" ? []:countries.split(","));
  };

  return (
    <FlexContainer>
      <GridContainer>
        Total Cases
          <Switch
          onChange={handleSwitch}
        />
      </GridContainer>
      <GridContainer>
        Total Deaths
        <Switch
          onChange={handleSwitch}
        />
      </GridContainer>
      <GridContainer>
        New Cases
        <Switch
          onChange={handleSwitch}
        />
      </GridContainer>
      <GridContainer>
        New Deaths
          <Switch
          onChange={handleSwitch}
        />
      </GridContainer>
      <GridContainer>
        Google Search Terms
        <Input
          enableButton={true}
          placeholder={'Google Search Terms'}
          onChange={handleGoogleTerms}
          width={300}
        />
      </GridContainer>
      <GridContainer>
        Twitter Hashtags
        <Input
          enableButton={true}
          placeholder={'Twitter Hashtags'}
          onChange={handleTwitterTags}
          width={300}
        />
      </GridContainer>
      <GridContainer>
        Countries
        <Input
          enableButton={true}
          placeholder={'Location'}
          onChange={handleCountry}
          width={200}
        />
      </GridContainer>
      <GridContainer>
        <Button hover={true} onClick={santitisedDataFetch}>
          SUBMIT
        </Button>
      </GridContainer>
    </FlexContainer>
  );
};

export default SearchPanel;
