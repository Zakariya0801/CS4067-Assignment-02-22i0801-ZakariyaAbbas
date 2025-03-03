import React, { useState } from "react";
import { createContext, useContext } from "react";

const GlobalContext = createContext<any>(null);

interface User  {
  name: string;
  email: string;
}

export const useGlobalContext = () => {
  const context = useContext<any>(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User| null>(null);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
