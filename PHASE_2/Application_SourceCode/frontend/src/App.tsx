import React, { useState } from 'react';
import SearchPage from './pages/search-page';
import Menu from './components/side-menu/menu';
import styled from 'styled-components';
import GraphPage from './pages/graph-page'

const PageCSS = styled.div`
  font-family: Arial;
`

const PageContainer = styled.div`
  margin-left: 56px;
`;

const App = () => {
  const [tab, setTab] = useState(0);
  const tabList = ["Map Page", "COVID19 Page", "Ebola Page"];
  const pageList = [<SearchPage />, <GraphPage disease={"covid19"} start={"2020-01-20"} end={"2020-04-20"}/>, <GraphPage disease={"ebola"} start={"2014-08-29"} end={"2015-08-29"}/>,]
  return (
    <PageCSS>
      <Menu tab={tab} setTab={setTab} tabList={tabList}/>
      <PageContainer>
        {pageList[tab]}
      </PageContainer>
    </PageCSS>
  );
};
export default App;
