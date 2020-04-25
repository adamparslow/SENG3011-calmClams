import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Autocomplete from '../../components/autocomplete';
import Modal from '../../components/modal';
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

  const showModal = (error) => {
    var modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    var modalContents = modals[0].getElementsByClassName('modal-content') as HTMLCollectionOf<HTMLElement>;
    modalContents[0].getElementsByTagName('p')[0].textContent = error;
    modals[0].style.display = 'block';
  }

  const santitisedDataFetch = () => {
    let searchquery = '';
    try {
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error("Start Date must be earlier than End Date");
      }
      
      if (startDate) {
        searchquery += 'start_date=' + startDate + 'T00:00:00';
      } else {
        throw new Error("Please enter a Start Date");
      }

      if (endDate) {
        searchquery += '&end_date=' + endDate + 'T00:00:00';
      } else {
        throw new Error("Please enter an End Date");
      }

      if (location) {
        searchquery += '&location=' + location;
      }
      
      keyTerms && (searchquery += '&key_terms=' + keyTerms);
    } catch (err) {
      console.error(err);
      showModal(err);
      return null;
    }
    return props.fetchData(searchquery);
  };

  return (
    <FlexContainer id="top">
      <Modal></Modal>
      <GridContainer>
        START DATE
        <DateInput onChange={handleStartDateChange} width={200} />
      </GridContainer>
      <GridContainer>
        END DATE
        <DateInput onChange={handleEndDateChange} width={200} />
      </GridContainer>
      <GridContainer>
        <Autocomplete onChange={handleKeyTerms} options={'key_terms'} label={'KEY TERMS'} placeholder={'Key Terms'} />
      </GridContainer>
      <GridContainer>
        <Autocomplete onChange={handleKeyTerms} options={'countries'} label={'COUNTRIES'} placeholder={'Countries'} />
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
