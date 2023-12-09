import { createContext, useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateReamainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateReamainingTime(storedExpirationDate);
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

const AuthContextProvider = ({ children }) => {
  const tokenData = retrieveStoredToken();
  let initalToken;
  if (tokenData) {
    initalToken = tokenData.token;
  }

  const [token, setToken] = useState(initalToken);

  const userIsLoggedIn = !!token;

  const logOutHandler = useCallback(() => {
    setToken(null);

    //removing the token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  function logInHandler(token, expirationTime) {
    setToken(token);

    //storing the token in local storage as well
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateReamainingTime(expirationTime);

    //logging the user out when token expires
    // setTimeout(logOutHandler, remainingTime);
    logoutTimer = setTimeout(logOutHandler, remainingTime);
  }

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
