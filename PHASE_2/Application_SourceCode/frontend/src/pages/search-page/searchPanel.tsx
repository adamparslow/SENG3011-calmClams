import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Input from '../../components/input';
import Modal from '../../components/modal';
import TextField from '../../components/autocomplete';
import config from '../../config';
import DateInput from '../../components/date-picker';
//import Autocomplete from '@material-ui/lab/Autocomplete';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
//import TextField from '@material-ui/core/TextField';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 500,
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
  }),
);

interface SearchPanelProps {
  fetchData: (
    searchquery: string,
  ) => void;
  error: boolean;
}

export const SearchPanel = (props: SearchPanelProps) => {
  const classes = useStyles();
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
      <Autocomplete
        multiple
        id="tags-standard"
        options={key_terms}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="KEY TERMS"
            placeholder={'Key Terms'}
            onChange={handleKeyTerms}
            //toolTipTitle={'Help'}
            //toolTipMessage={'Type out your key terms separated by commas.\nAll reports relating to those countries will be displayed on the map and below in the reports section.\nIf left blank, it will search for all reports.'}
          />
        )}
      />
      </GridContainer>
      <GridContainer>
        <Autocomplete
        multiple
        id="tags-standard"
        options={countries}
        getOptionLabel={(option) => option}
        defaultValue={[countries[0]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="LOCATIONS"
            placeholder={'Locations'}
            onChange={handleLocation}
            //toolTipTitle={'Help'}
            //toolTipMessage={'Type out your countries separated by commas.\nAll reports relating to those countries will be displayed on the map and below in the reports section.\nIf left blank, it will search for all reports.'}
          />
        )}
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

const countries = ["Global","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
const key_terms = ["Rift Valley Fever","Crimean Congo Hemorrhagic Fever","Dengue","Ebola","Marburg","Zika","MERS","Salmonella","Legionnaire","Measles","Anthrax","Botulism","Plague","Smallpox","Tularemia","Junin Fever","Machupo Fever","Guanarito Fever","Chapare Fever","Lassa Fever","Lujo Fever","Hantavirus"];

export default SearchPanel;
