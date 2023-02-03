import { BSON } from "realm-web";
import { FC, useState, useRef } from "react";
import { AutoComplete } from "antd";
import useDatabase from "../../data/useDatabase";

const DEFER_TIME = 1000;

// Intended for use in SeaFreight and AirCargo form marking tables.

const SearchMarking: FC<ISearchProps> = props => {
  const { onChange } = props;
  const database = useDatabase();
  const [value, setValue] = useState('');
  const [references, setReferences] = useState<Array<IMarking>>();
  const fetchTimeout = useRef<NodeJS.Timeout>();
  const valid = useRef(true);

  const fetchMarkings = (value: string) => {
    // Fetch the list of all customer markings that match the input value.
    database?.collection('Customers')
      .aggregate([
        { $project: { marking: '$markings' } },
        { $unwind: "$marking" },
        { $match: { marking: { $regex: new RegExp('^' + value, 'i') } } }
      ])
      .then(results => setReferences(results));

    fetchTimeout.current = undefined;
  }

  const resetValue = () => {
    setValue('');
    onChange(undefined);
  }

  return (
    <AutoComplete allowClear
      placeholder="Marking"
      value={value}
      onChange={value => {
        setValue(value);
        valid.current = false; // The value is invalid if it is simply typed in manually.
      }}
      onClear={resetValue}
      options={references?.map(reference => ({ value: reference.marking }))}
      onSearch={value => {
        // Basically tries to replicate the way 'useDeferredValue' works.
        // This is to prevent spamming the database with every character input.
        setReferences(undefined);
        if (fetchTimeout.current != null) {
          clearTimeout(fetchTimeout.current);
        }
        fetchTimeout.current = setTimeout(() => fetchMarkings(value), DEFER_TIME);
      }}
      onSelect={(value: string) => {
        onChange(value);
        valid.current = true; // The value is valid if it is selected from the list of markings.
      }}
      status={valid.current ? "" : "error"}
      onBlur={() => {
        // If the value is invalid when leaving the component, clear the value.
        if (!valid.current) {
          resetValue();
        }
      }} />
  );
}

export default SearchMarking;

interface ISearchProps {
  onChange: (value: string | undefined) => void
}

interface IMarking {
  _id: BSON.ObjectId
  marking: string
}
