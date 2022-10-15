import {useState,useCallback,useEffect} from 'react';

let logoutTimer;

export const useAuth=()=>{
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const loginHandler = useCallback((userId, token, expirationDate) => {
      setToken(token);
      setUserId(userId);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    }, []);

    const logoutHandler = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpirationDate(null);
      localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remainingTime =
          tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logoutHandler, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logoutHandler, tokenExpirationDate]);

    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        loginHandler(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }, [loginHandler]);

    return {token,loginHandler,logoutHandler,userId};
}