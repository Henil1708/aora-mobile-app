import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppWrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();

      setData(response);
    } catch (error) {
      Alert.alert("Opps,", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refetchData = () => fetchData();

  return { data, isLoading, refetchData };
};

export default useAppWrite;
