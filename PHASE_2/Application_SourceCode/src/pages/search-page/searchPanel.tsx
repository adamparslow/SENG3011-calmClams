import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Input from '../../components/input';
import config from '../../config';
import DateInput from '../../components/date-picker';

const FlexContainer = styled.div`
  display: flex;
  background: ${config.theme.darkColor};
  align-items: center;
  padding-left: 100px;
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
    searchquery: string,
  ) => void;
  error: boolean;
}

export const SearchPanel = (props: SearchPanelProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyTerms, setKeyTerms] = useState('');
  const [location, setLocation] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleKeyTerms = (event) => {
    setKeyTerms(event.target.value);
  };
  const handleLocation = (event) => {
    setLocation(event.target.value);
  };
  const santitisedDataFetch = () => {
    let searchquery = '';
    try {
      if (startDate) {
        searchquery += 'end_date=' + endDate + 'T00:00:00';
      } else {
        throw new Error("End Date Invalid");
      }

      if (endDate) {
        searchquery += '&start_date=' + startDate + 'T00:00:00'; 
      } else {
        throw new Error("Start Date Invalid");
      }

      if (location) {
        searchquery += '&location=' + location;
      } else {
        throw new Error("Location Invalid");
      }
      keyTerms && (searchquery += '&key_terms=' + keyTerms);
    } catch (err) {
      console.error(err);
      //Show error Screen
    }
    return props.fetchData(searchquery);
  };

  return (
    <FlexContainer>
      <GridContainer>
        START DATE
        <DateInput onChange={handleStartDateChange} width={200} />
      </GridContainer>
      <GridContainer>
        END DATE
        <DateInput onChange={handleEndDateChange} width={200} />
      </GridContainer>
      <GridContainer>
        KEY TERMS
        <Input
          enableButton={true}
          placeholder={'Key Terms'}
          onChange={handleKeyTerms}
          width={400}
        />
      </GridContainer>
      <GridContainer>
        LOCATION
        <Input
          enableButton={true}
          placeholder={'Location'}
          onChange={handleLocation}
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
