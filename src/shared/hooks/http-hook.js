import { useEffect, useState, useRef, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest =useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setIsLoading(true);

    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signals: httpAbortCtrl,
      });
      const responseData = await response.json();
      // console.log(responseData);

      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return responseData;
    } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
    }
  },[]);

  // useEffect(() => {
  //   return ()=>{
  //       activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
  //   }
  // }, []);

  const errorHandler = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, errorHandler };
};
