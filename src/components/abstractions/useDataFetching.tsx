import { useState, useEffect } from "react";
import useDatabase from "../../data/useDatabase";

// TODO: Implement pagination.

function useDataFetching(collectionName: string, defaultSearchKey: string, customQuery?: Query) {
  const database = useDatabase();
  const [data, setData] = useState<Array<any>>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<RegExp>();
  const [searchKey, setSearchKey] = useState(defaultSearchKey);

  const fetchData = () => {
    if (customQuery)
      return customQuery(collectionName, search, searchKey);
    else if (!search) 
      return database?.collection(collectionName).find();
    else 
      return database?.collection(collectionName).find({ 
        [searchKey]: { $regex: search, $options: 'i' } 
      });
  };

  const refreshData = () => {
    setLoading(true);
    fetchData()
      ?.then(results => {
        if (results) setData(results);
      })
      .finally(() => setLoading(false));
  };

  useEffect(refreshData, [search]);
  return { data, loading, searchKey, setSearch, setSearchKey, refreshData };
}

export type { Query };
export default useDataFetching;

type Query = (collectionName: string, search: RegExp | undefined, searchBy: string) => Promise<any> | undefined;
