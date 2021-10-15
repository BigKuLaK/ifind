import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  ADMIN_API_ROOT,
  userTokenHandle,
} from "@config/adminApi";

import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { spriteContents } from "ifind-icons";

const token = localStorage.getItem(userTokenHandle) || null;

// Admin Link
const adminApiLink = new HttpLink({
  uri: ADMIN_API_ROOT,
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const client = new ApolloClient({
  link: adminApiLink,
  cache: new InMemoryCache().restore({}),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
