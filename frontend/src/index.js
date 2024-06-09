import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', 
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#335C6E',
    },
    secondary: {
      main: '#F76434',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ApolloProvider>
);
