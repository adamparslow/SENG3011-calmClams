import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Input from '../../components/input';
import config from '../../config';
import Switch from '../../components/switch';
import Modal from '../../components/modal';

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
    countries: Array<string>,
  ) => void;
  error: boolean;
  totalCases: boolean;
  setTotalCases: (value: boolean) => void;
  totalDeaths: boolean;
  setTotalDeaths: (value: boolean) => void;
  newCases: boolean;
  setNewCases: (value: boolean) => void;
  newDeaths: boolean;
  setNewDeaths: (value: boolean) => void;
}

export const SearchPanel = (props: SearchPanelProps) => {
  const {
    totalCases,
    setTotalCases,
    totalDeaths,
    setTotalDeaths,
    newCases,
    setNewCases,
    newDeaths,
    setNewDeaths,
  } = props;
  const [googleTerms, setGoogleTerms] = useState('');
  const [twitterTags, setTwitterTags] = useState('');
  const [countries, setCountries] = useState('');

  const handleSwitch = (event, setSwitch) => {
    setSwitch(event);
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
    let searchquery = '';
    try {
      if (googleTerms.length + twitterTags.length + countries.length === 0) {
        throw new Error(
          'Please enter a Google search term, Twitter hashtag or Country',
        );
      }
    } catch (err) {
      showModal(err);
      return null;
    }
    return props.fetchData(
      true,
      false,
      false,
      false,
      googleTerms === '' ? [] : googleTerms.split(','),
      [],
      countries === '' ? [] : countries.split(','),
    );
  };

  const showModal = (error) => {
    var modals = document.getElementsByClassName('modal') as HTMLCollectionOf<
      HTMLElement
    >;
    var modalContents = modals[0].getElementsByClassName(
      'modal-content',
    ) as HTMLCollectionOf<HTMLElement>;
    modalContents[0].getElementsByTagName('p')[0].textContent = error;
    modals[0].style.display = 'block';
  };

  return (
    <FlexContainer>
      <Modal error={() => 'error'}></Modal>
      <GridContainer>
        Total Cases
        <Switch
          checked={totalCases}
          onChange={(event) => handleSwitch(event, setTotalCases)}
        />
      </GridContainer>
      <GridContainer>
        Total Deaths
        <Switch
          checked={totalDeaths}
          onChange={(event) => handleSwitch(event, setTotalDeaths)}
        />
      </GridContainer>
      <GridContainer>
        New Cases
        <Switch
          checked={newCases}
          onChange={(event) => handleSwitch(event, setNewCases)}
        />
      </GridContainer>
      <GridContainer>
        New Deaths
        <Switch
          checked={newDeaths}
          onChange={(event) => handleSwitch(event, setNewDeaths)}
        />
      </GridContainer>
      <GridContainer>
        Google Search Terms
        <Input
          enableButton={true}
          placeholder={'Google Search Terms'}
          onChange={handleGoogleTerms}
          width={300}
          className=""
          toolTipTitle={'Help'}
          toolTipMessage={'Type out your search terms separated by commas.\nEach search term will be a new graph.\nType [seachTerm]:[country] to narrow the search down to an individual country'}
        />
      </GridContainer>
      <GridContainer>
        Twitter Hashtags
        <Input
          enableButton={true}
          placeholder={'Twitter Hashtags'}
          onChange={handleTwitterTags}
          width={300}
          toolTipTitle={'Help'}
          toolTipMessage={'Not Yet Implemented'}
        />
      </GridContainer>
      <GridContainer>
        Countries
        <Input
          enableButton={true}
          placeholder={'Location'}
          onChange={handleCountry}
          width={200}
          toolTipTitle={'Help'}
          toolTipMessage={'Type out your countries separated by commas.\nEach country will be a new graph.'}
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
