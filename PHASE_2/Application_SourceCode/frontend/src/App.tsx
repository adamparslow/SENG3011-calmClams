import React, { useState } from 'react';
import SearchPage from './pages/search-page';
import Menu from './components/side-menu/menu';
import styled from 'styled-components';
import GraphPage from './pages/graph-page'


const PageContainer = styled.div`
  margin-left: 56px;
  font-family: Arial;
`;

const App = () => {
  const [tab, setTab] = useState(0);
  const tabList = ["Graph Page", "Map Page"];
  const pageList = [<GraphPage/>, <SearchPage />]
  return (
    <>
      <Menu tab={tab} setTab={setTab} tabList={tabList}/>
      <PageContainer>
        {pageList[tab]}
      </PageContainer>
    </>
  );
};
export default App;
