import React, { useState } from 'react';
import styled from 'styled-components';
import config from '../../config';

const HeaderContainer = styled.div`
  width: 120vh;
  height: 30px;
  margin: 15px;
  padding: 10px;
  border-radius: ${({ expanded }) => (expanded ? '10px 10px 0px 0px' : '10px')};
  background: ${config.theme.primaryDarkGrey};
  color: ${config.theme.primaryDark};
  font-size: 24px;
  font-weight: bold;
  &:hover {
    background: ${config.theme.lightColor};
  }
  margin-bottom: ${({ expanded }) => (expanded ? '0px' : '15px')};
`;
const TextContainer = styled.div`
  color: ${config.theme.primaryDark};
  display: ${({ expanded }) => (expanded ? 'display' : 'none')};
  font-size: 16px;
  width: 120vh;
  height: 80px;
  margin: 15px;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
  background: ${config.theme.primaryLightGrey};
  margin-top: 0px;
`;

const sanitiseHeader = (header: string) => {
  if (!header.charAt(85)) {
    return header;
  }
  for (var i = header.length - 1; i >= 0; i--) {
    if (header.charAt(i) === ' ') {
      return header.substring(0, i) + '...';
    }
  }
  return 'Error - Title Invalid';
};
const sanitiseText = (text: string) => {
    return text.substring(
        0,
        text.indexOf('Read the full article'),
      ) ||
      text.substring(
        0,
        text.indexOf('Read Full Article At'),
      );
}

const SearchReport = (props) => {
  const [expanded, setExpanded] = useState(false);
  const article = props.article;
  const maintext = sanitiseText(article.main_text);
  const headline = sanitiseHeader(article.headline);
  console.log(JSON.stringify(article));
  console.log(article.headline);
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <HeaderContainer expanded={expanded} onClick={handleExpand}>
        {headline}
      </HeaderContainer>
      <TextContainer expanded={expanded}>{maintext}</TextContainer>
    </>
  );
};

export default SearchReport;
