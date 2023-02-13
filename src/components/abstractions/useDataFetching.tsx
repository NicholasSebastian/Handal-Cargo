import { useState, useEffect } from "react";
import { BSON } from "realm-web";
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
        [searchKey]: { $regex: search } 
      });
  };

  const refreshData = () => {
    setLoading(true);
    fetchData()
      ?.then(results => {
        if (results) {
          setData(results);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(refreshData, [search]);
  return { data, loading, searchKey, setSearch, setSearchKey, refreshData };
}

function useBasicDataFetching(collectionName: string, id: ID, setValues: ResultDump, customQuery?: BasicQuery) {
  const database = useDatabase();

  const fetchData = () => {
    if (customQuery) 
      return customQuery(collectionName, id!);
    else 
      return database?.collection(collectionName).findOne({ _id: id });
  }

  useEffect(() => {
    if (id != null) {
      fetchData()?.then(results => {
        if (results) {
          setValues(results);
        }
      });
    }
  }, []);
}

export type { Query, BasicQuery };
export { useBasicDataFetching };
export default useDataFetching;

type Query = (collectionName: string, search: RegExp | undefined, searchBy: string) => Promise<any> | undefined;
type BasicQuery = (collectionName: string, id: BSON.ObjectId) => Promise<any> | undefined;
type ID = BSON.ObjectId | undefined;
type ResultDump = React.Dispatch<React.SetStateAction<any>>;
