import { createContext, useEffect, useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { BASIC_USER_NAME, BASIC_USER_PASSWORD, apiSourceHandle, userTokenHandle } from '@config/adminApi';
import loginUserQuery from '@gql/loginUserQuery';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [
        loginUser,
        {
            // loading,
            // error,
            data,
        }
    ] = useMutation(loginUserQuery);
    const [ token, setToken ] = useState(window.localStorage.getItem(userTokenHandle));

    // Login basic user to get token if not yet set
    useEffect(() => {
        if ( !token ) {
            loginUser({
                variables: {
                    username: BASIC_USER_NAME,
                    password: BASIC_USER_PASSWORD
                },
                context: { apiSource: apiSourceHandle }
            });
        }
    }, [ token, loginUser ]);

    // Set token based from the fetched jwt
    useEffect(() => {
        if ( data?.login?.jwt ) {
            window.localStorage.setItem(userTokenHandle, data.login.jwt);
            setToken(data.login.jwt);
        }
    }, [ data, setToken ]);

    return (
        <AuthContext.Provider value={{ token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}

// Export as default to be used in testing
export default AuthContext;