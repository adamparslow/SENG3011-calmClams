import React, { useState } from 'react';
import SearchPage from './pages/search-page';
import Burger from './components/side-menu/burger';
import Menu from './components/side-menu/menu';
import styled from 'styled-components';


const PageContainer = styled.div`
  margin-left: 56px;
`;

const App = () => {
  const [tab, setTab] = useState(0);
  return (
    <>
      
      <Menu tab={tab} setTab={setTab}/>
      <PageContainer>
        <SearchPage />
      </PageContainer>
    </>
  );
};
export default App;
