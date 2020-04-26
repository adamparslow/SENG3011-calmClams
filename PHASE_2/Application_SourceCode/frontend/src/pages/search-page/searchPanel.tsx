import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Autocomplete from '../../components/autocomplete';
import Modal from '../../components/modal';
import config from '../../config';
import DateInput from '../../components/date-picker';
import HelpButton from '../../components/helpButton';


const FlexContainer = styled.div`
  display: flex;
  background: ${config.theme.darkColor};
  align-items: center;
  justify-content: space-around;
`;

const GridContainer = styled.div`
  display: grid;
  padding: 10px;
  color: ${config.theme.primaryLight};
  font-size: 12px;
  text-align: center;
`;

const DateContainer = styled.div`
  background: white;
  color: grey;
  border-radius: 5px 5px 0px 0px;
  text-align: left;
  padding-left: 10px;
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
  const [keyTerms, setKeyTerms] = useState([]);
  const [location, setLocation] = useState([] as string[]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleKeyTerms = (event, value, reason) => {
    setKeyTerms(value);
  };
  const handleLocation = (event, value, reason) => {
    setLocation(value);
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

      if (location.length > 0 && !location.includes("Global")) {
        searchquery += '&location=' + location.join();
      }
      
      keyTerms && (searchquery += '&key_terms=' + keyTerms.join());
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
        <DateContainer>START DATE</DateContainer>
        <DateInput onChange={handleStartDateChange} width={200} />
      </GridContainer>
      <GridContainer>
        <DateContainer>END DATE</DateContainer>
        <DateInput onChange={handleEndDateChange} width={200} />
      </GridContainer>
      <FlexContainer>
        <Autocomplete onChange={handleKeyTerms} options={'key_terms'} label={'KEY TERMS'} placeholder={'Key Terms'} defaultValue={[]} />
        <HelpButton height="55px" toolTipMessage={'Type out your key terms separated by commas.\nAll reports relating to those countries will be displayed on the map and below in the reports section.\nIf left blank, it will search for all reports.'} toolTipTitle={"Help"}></HelpButton>
      </FlexContainer>
      <FlexContainer>
        <Autocomplete onChange={handleLocation} options={'countries'} label={'COUNTRIES'} placeholder={'Countries'} defaultValue={[]} />
        <HelpButton height="55px" toolTipMessage={'Type out your countries separated by commas.\nAll reports relating to those countries will be displayed on the map and below in the reports section.\nIf left blank, it will search for all reports.'} toolTipTitle={"Help"}></HelpButton>
      </FlexContainer>
      <GridContainer>
        <Button hover={true} onClick={santitisedDataFetch}>
          SUBMIT
        </Button>
      </GridContainer>
    </FlexContainer>
  );
};

export default SearchPanel;
