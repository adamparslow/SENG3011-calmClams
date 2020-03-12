import React from 'react';
import client from './Components/apolloClient/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { ExchangeRates } from './Components/apolloClient/queries';

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>Placeholder for an entire website!</h2>
      {/* Exchange Rates is an example of using apollo */}
      <ExchangeRates/>
    </div>
  </ApolloProvider>
)

export default App;