import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const METHODS = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete",
};

export default function useAxios({
  initialData = null,
  baseURL = "",
  timeout = 5000,
  consoleLog = false,
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const instanceRef = useRef(null);
  const history = useHistory();

  // Instance oluşturma logging'i
  useEffect(() => {
    instanceRef.current = axios.create({
      baseURL,
      timeout,
    });

    if (consoleLog) {
      console.log("🔧 Axios Instance Created:", {
        baseURL,
        timeout,
        timestamp: new Date().toISOString(),
      });
    }
  }, [baseURL, timeout, consoleLog]);

  const sendRequest = useCallback(
    async ({
      url,
      method,
      data = null,
      redirect = null,
      callbackSuccess = null,
      callbackError = null,
      alwaysApply = null,
    }) => {
      const controller = new AbortController();
      const requestInfo = {
        timestamp: new Date().toISOString(),
        url: `${baseURL}${url}`,
        method: method.toUpperCase(),
        requestData: data,
        redirect: redirect || "No redirect specified",
      };

      if (consoleLog) {
        console.group("🔄 API Request Lifecycle");
        console.log("Request Details:", requestInfo);
      }

      try {
        setLoading(true);
        setError(null);

        const response = await instanceRef.current[method](url, data, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          if (consoleLog) {
            console.log("Request Status: Aborted (Component unmounted)");
            console.groupEnd();
          }
          return;
        }

        setData(response.data);

        if (consoleLog) {
          console.log("Response Details:", {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            timestamp: new Date().toISOString(),
          });
        }

        if (callbackSuccess) {
          await callbackSuccess(response.data);
        }

        if (redirect) {
          history.push(redirect);
        }

        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          if (consoleLog) {
            console.log("Request Status: Cancelled");
            console.groupEnd();
          }
          return;
        }

        const errorMessage = error.response?.data?.message || error.message;

        if (!controller.signal.aborted) {
          setError(errorMessage);
        }

        if (consoleLog) {
          console.log("Error Details:", {
            message: errorMessage,
            sqliteError: error?.err,
            fullError: error,
            responseData: error.response?.data,
            status: error.response?.status,
            timestamp: new Date().toISOString(),
          });
        }

        if (callbackError) {
          await callbackError(errorMessage);
        }

        throw error;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }

        if (alwaysApply) {
          await alwaysApply();
        }

        if (consoleLog) {
          console.log("Request Status: Completed");
          console.groupEnd();
        }
      }
    },
    [history, baseURL, consoleLog]
  );

  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        if (consoleLog) {
          console.log("🧹 Cleaning up active requests");
        }
        instanceRef.current.interceptors.request.use((config) => {
          if (config.signal) {
            config.signal.abort();
          }
          return config;
        });
      }
    };
  }, [consoleLog]);

  return {
    data,
    error,
    loading,
    sendRequest,
    setData,
    setError,
    setLoading,
  };
}
