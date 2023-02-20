import { useState, useEffect, useMemo } from "react";
import { Form, FormInstance } from "antd";
import { FormItem } from "../basics/BasicForm";
import useDatabase from "../../data/useDatabase";

const { useWatch } = Form;
const DEFAULT_SYMBOL = 'Rp.';

// Intended for use within the BasicForm component.

function useCurrencyHandling(form: FormInstance, formItems: Array<FormItem>) {
  const database = useDatabase();
  const [reference, setReference] = useState<Record<string, string>>();
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);

  // Check if the form contains a 'currency' field.
  const currencyFieldExists = useMemo(() => 
    formItems.some(item => (item !== 'pagebreak') && ('key' in item) && item.key === 'currency'), 
    [formItems]);

  // If it does, fetch the Currencies reference from the database.
  useEffect(() => {
    if (currencyFieldExists) {
      database?.collection('Currencies')
        .find({}, { projection: { _id: 0 }})
        .then(currencies => {
          const reference = Object.fromEntries(currencies?.map(currency => [currency.name, currency.symbol]));
          setReference(reference);

          // Then update the 'symbol' state.
          const currency = form.getFieldValue('currency');
          const symbol = reference[currency];
          setSymbol(symbol);
        });
    }
  }, [currencyFieldExists]);

  // Then whenever the 'currency' field changes, change the 'symbol' state.
  const currency = useWatch('currency', form);
  useEffect(() => {
    if (currency && reference) {
      const symbol = reference[currency];
      setSymbol(symbol);
    }
  }, [currency]);

  return symbol;
}

export { DEFAULT_SYMBOL };
export default useCurrencyHandling;
