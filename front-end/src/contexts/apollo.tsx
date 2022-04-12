// import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
// import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from "@apollo/client";
import { ADMIN_API_ROOT } from "@config/adminApi";
import { PropsWithChildren, ReactNode } from "react";

// Admin Link
const adminApiLink = new HttpLink({
  uri: ADMIN_API_ROOT,
  // headers: {
  //   authorization: `Bearer ${token}`,
  // },
});

export const client = new ApolloClient({
  uri: ADMIN_API_ROOT,
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }: PropsWithChildren<ReactNode>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloWrapper;
