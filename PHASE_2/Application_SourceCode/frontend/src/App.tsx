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
  const tabList = ["Graph Page", "Map Page"];
  const pageList = [<SearchPage />, <GraphPage/>]
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
