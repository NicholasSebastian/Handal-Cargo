import createSwitchableValue from "../basics/SwitchableValue";

function getSwitchableCustomerNumber(label: string, altKey: string) {
  return createSwitchableValue({ 
    label: label, 
    labelSpan: 11,
    altSource: {
      localField: 'marking',
      getter: async (database, marking) => {
        const customers = database?.collection('Customers');
        const result = await customers?.findOne({ markings: marking }, { projection: { [altKey]: 1 } });
        return result.home_number_2;
      }
    }
  });
}

export default getSwitchableCustomerNumber;
