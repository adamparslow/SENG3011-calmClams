import React, { memo } from 'react';
import styled from 'styled-components';
import config from '../../config';
import { FaRegArrowAltCircleUp, FaLink, FaClock } from 'react-icons/fa';

const HeaderContainer = styled.div`
  width: 120vh;
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
  cursor: pointer;
`;
const ContextContainer = styled.div`
  color: ${config.theme.primaryDark};
  display: ${({ expanded }) => (expanded ? 'display' : 'none')};
  font-size: 16px;
  width: 120vh;
  margin: 15px;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
  background: ${config.theme.primaryLightGrey};
  margin-top: 0px;
`;
const TextContainer = styled.div`
  margin: 5px;
`;
const InvButton = styled.button`
  background: transparent;
  border: none !important;
  font-size: 18px;
  margin-right: 10px;
`;
const OptionsTextStyle = styled.span`
  position: relative;
  margin-left: 5px;
  bottom: 2px;
`;
const OptionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
`;
const RightBar = styled.div`

`
const dateFormat = (input: String) => {
  //We are formatting strings in the style of: 2015-11-02 02:32:xx
  return (
    input.substring(5, 7) +
    '/' +
    input.substring(8, 10) +
    '/' +
    input.substring(0, 4)
  );
};
const sanitiseHeader = (header: string) => {
  if (!header.charAt(80)) {
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
  return (
    text.substring(0, text.indexOf('Read the full article')) ||
    text.substring(0, text.indexOf('Read Full Article At')) ||
    text
  );
};
const shouldUpdate = (prevprops, nextprops) => {
  return prevprops.expanded === nextprops.expanded;
};
interface SearchReportProps {
  article: any;
  expanded: boolean;
  toggleReport: () => void;
}

const SearchReport = (props: SearchReportProps) => {
  const { toggleReport, expanded } = props;
  const article = props.article;
  console.log(article);
  const maintext = sanitiseText(article.main_text);
  const headline = sanitiseHeader(article.headline);
  const handleExpand = () => {
    toggleReport();
  };
  return (
    <>
      <HeaderContainer
        id={article._id}
        expanded={expanded}
        onClick={handleExpand}
      >
        {headline}
      </HeaderContainer>
      <ContextContainer expanded={expanded}>
        <TextContainer>{maintext}</TextContainer>
        <OptionsBar>
          <InvButton>
            <FaClock />
            <OptionsTextStyle>
              {dateFormat(article.date_of_publication)}
            </OptionsTextStyle>
          </InvButton>
          <RightBar>
            <InvButton
              onClick={() => {
                window.open(article.url, '_blank');
              }}
              style={{cursor: 'pointer'}}
            >
              <FaLink />
              <OptionsTextStyle>See Full Report</OptionsTextStyle>
            </InvButton>
            <InvButton
              onClick={() => {
                window.location.href = '#top';
              }}
              style={{cursor: 'pointer'}}
            >
              <FaRegArrowAltCircleUp />
              <OptionsTextStyle>Back To Top</OptionsTextStyle>
            </InvButton>
          </RightBar>
        </OptionsBar>
      </ContextContainer>
    </>
  );
};

export default memo(SearchReport, shouldUpdate);
