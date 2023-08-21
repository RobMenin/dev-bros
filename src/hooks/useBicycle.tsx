import { useEffect, useState } from "react";
import { BicycleList } from "../types/bicycleTypes";
import { data } from "../data";

const useBicycleData = (): BicycleList[] => {
  const [bicycleList, setBicycleList] = useState<BicycleList[]>([]);

  const getBicycleData = (): Promise<BicycleList[]> => {
    return Promise.resolve(data);
  };

  useEffect(() => {
    getBicycleData()
      .then((data) => setBicycleList(data))
      .catch((err) => console.log(err));
  }, []);

  return bicycleList;
};

export default useBicycleData;
