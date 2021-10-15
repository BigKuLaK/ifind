import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

export const adminUserQuery = `
query {
  me {
    id
  }
}
`

export const AdminUserContext = createContext({});

export const AdminUserProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const [ adminUser, setAdminUser ] = useState(null);
  
  useEffect(() => {
    gqlFetch(adminUserQuery)
    .then(data => {
      if ( data?.me ) {
        setAdminUser(data.me);
      }
    });
  }, []);

  return (
    <AdminUserContext.Provider value={{
      adminUser
    }}>
      { children }
    </AdminUserContext.Provider>
  )
}

export const useAdminUser = () => useContext(AdminUserContext);