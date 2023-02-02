import { useState, useEffect } from 'react';
import useDatabase from '../../data/useDatabase';
import { FormItem, RenderItem, ISelectItem } from '../basics/BasicForm';

// Intended for use within the BasicForm component.

const isItem = (item: FormItem): item is RenderItem => item !== 'pagebreak';
const isSelect = (item: RenderItem): item is ISelectItem => item.type === 'select';
const requireFetch = (item: ISelectItem) => typeof item.items === 'string';
const getReferenceItems = (items: Array<FormItem>) => 
  items.filter(item => isItem(item) && isSelect(item) && requireFetch(item)) as Array<ISelectItem>;

function useReferenceHandling(formItems: Array<FormItem>) {
  const database = useDatabase();
  const [reference, setReference] = useState<ReferenceValues>();

  // Fetches all the corresponding reference data required for the form from the database.
  useEffect(() => {
    const referenceItems = getReferenceItems(formItems);
    Promise.all(
      referenceItems.map(item => {
        const collectionName = item.items as string;
        return database?.collection(collectionName)
          .find({}, { projection: { name: 1 } });
      }))
    .then(references => {
      const values = Object.fromEntries(references.map((values, i) => {
        const collectionName = referenceItems[i].items;
        return [collectionName, values?.map(v => v.name)];
      }));
      setReference(values);
    });
  }, []);

  return reference;
}

// Returns the proper data based on the type given.
function getSelectItems(arg: string | string[] | undefined, reference: ReferenceValues) {
  if (Array.isArray(arg)) 
    return arg;
  else if (typeof arg === 'string' && reference) 
    return reference[arg];
  else
    return undefined;
}

export { getSelectItems };
export default useReferenceHandling;

type ReferenceValues = Record<string, Array<string>> | undefined
