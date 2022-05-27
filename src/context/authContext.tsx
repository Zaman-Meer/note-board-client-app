import React, { useEffect, useState } from "react";
import { UserType } from "../types";

interface initialStateTypes {
  isLogin: boolean;
  userData: UserType | null;
  isLoading: boolean;
  error: string;
  login: (name: string) => void;
  logout: () => void;
}

const initialState: initialStateTypes = {
  isLogin: false,
  userData: null,
  isLoading: false,
  error: "",
  login: (name: string) => {},
  logout: () => {},
};

export const AuthContext = React.createContext(initialState);

interface Props {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const login = async (name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false);
      window.localStorage.setItem("userInfo", JSON.stringify(data));
      setUserData(data);
      setIsLogin(true);
    } catch (error: any) {
      setIsLoading(false);
      setError(error?.message);
    }
  };
  useEffect(() => {
    const userInfo = window.localStorage.getItem("userInfo");
    if (userInfo) {
      const data = JSON.parse(userInfo);
      setUserData(data);
      setIsLogin(true);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("userInfo");
    setIsLogin(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        isLogin,
        userData,
        isLoading,
        error,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
