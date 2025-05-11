import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt'));

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('jwt', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('jwt');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);