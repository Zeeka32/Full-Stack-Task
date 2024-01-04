import React, { ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  username: string | null;
  setUsername: (value: string | null) => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, token, setToken, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};