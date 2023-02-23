import createSwitchableValue from "../basics/SwitchableValue";

function getSwitchableCustomerValue(label: string, altKey: string, textarea = false, disabled = false) {
  return createSwitchableValue({ 
    label, 
    labelSpan: 11,
    textarea,
    disabled,
    altSource: {
      localField: 'marking',
      getter: async (database, marking) => {
        const customers = database?.collection('Customers');
        const result = await customers?.findOne({ markings: marking }, { projection: { [altKey]: 1 } });
        return result[altKey];
      }
    }
  });
}

export default getSwitchableCustomerValue;
