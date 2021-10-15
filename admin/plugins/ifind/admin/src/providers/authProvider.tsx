import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [ jwt ] = useState(( 
    window.sessionStorage.getItem('jwtToken')
    || window.localStorage.getItem('jwtToken')
    || '' ).replace(/"/g, ''));

  return (
    <AuthContext.Provider value={{ jwt }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
}