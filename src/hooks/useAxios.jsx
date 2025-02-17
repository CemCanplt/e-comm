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
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Instance'ı useRef ile saklayarak gereksiz yeniden oluşturmayı engelleyelim
  const instanceRef = useRef(null);
  const history = useHistory();

  // Instance'ı sadece bir kere oluşturalım
  useEffect(() => {
    instanceRef.current = axios.create({
      baseURL,
      timeout,
    });
  }, [baseURL, timeout]);

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
      // İstek iptal edilebilsin
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await instanceRef.current[method](url, data, {
          signal: controller.signal,
        });

        // Component unmount olduysa işlemi iptal edelim
        if (controller.signal.aborted) return;

        setData(response.data);

        if (callbackSuccess) {
          await callbackSuccess(response.data);
        }

        if (redirect) {
          history.push(redirect);
        }

        return response.data;
      } catch (error) {
        // Eğer istek iptal edildiyse hata göstermeyelim
        if (axios.isCancel(error)) {
          return;
        }

        const errorMessage = error.response?.data?.message || error.message;

        // Component unmount olduysa hata state'ini güncellemeyelim
        if (!controller.signal.aborted) {
          setError(errorMessage);
        }

        if (callbackError) {
          await callbackError(errorMessage);
        }

        throw error;
      } finally {
        // Component unmount olduysa loading state'ini güncellemeyelim
        if (!controller.signal.aborted) {
          setLoading(false);
        }

        if (alwaysApply) {
          await alwaysApply();
        }
      }
    },
    [history]
  );

  // Component unmount olduğunda tüm istekleri temizleyelim
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        // Tüm aktif istekleri iptal et
        instanceRef.current.interceptors.request.use((config) => {
          if (config.signal) {
            config.signal.abort();
          }
          return config;
        });
      }
    };
  }, []);

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
