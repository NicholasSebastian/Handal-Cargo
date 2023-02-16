import styled from "styled-components";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import createDependentValue from "../../../components/basics/DependentValue";
import { IMarkingsStuff } from "../../../components/compounds/ShippingTemplate";

const [TotalQuantity, TotalList, TotalHB] = [
  { key: 'quantity', label: 'Total Muatan' },
  { key: 'listkg', label: 'Total Berat (List)' },
  { key: 'hbkg', label: 'Total Berat (HB)' }
]
.map(field => createDependentValue({
  label: field.label,
  labelSpan: 12,
  dependencies: ['markings'],
  calculateValue: ([markings]) => {
    return markings.reduce((acc: number, marking: any) => acc + (marking[field.key] ?? 0), 0);
  },
  defaultValue: 0,
  suffix: 'kg'
}));

const RealDifference = createDependentValue({
  label: "Selisih Asli",
  labelSpan: 12,
  dependencies: ['markings'],
  calculateValue: ([markings]) => {
    const totalHB = markings.reduce((acc: number, marking: any) => acc + (marking.hbkg ?? 0), 0);
    const totalList = markings.reduce((acc: number, marking: any) => acc + (marking.listkg ?? 0), 0);
    return (totalHB - totalList).toFixed(1);
  },
  defaultValue: 0,
  suffix: 'kg'
});

const MasterDifference = createDependentValue({
  label: "Selisih Master",
  labelSpan: 12,
  dependencies: ['markings', 'clearance_weight'],
  calculateValue: ([markings, clearance_weight]) => {
    const totalHB = markings.reduce((acc: number, marking: any) => acc + (marking.hbkg ?? 0), 0);
    return (totalHB - clearance_weight).toFixed(1);
  },
  defaultValue: 0,
  suffix: 'kg'
});

const markingsStuff: IMarkingsStuff = {
  markingTableWidth: 950,
  markingFields: [
    { 
      key: 'listkg', 
      label: 'List (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined
    },
    { 
      key: 'hbkg', 
      label: 'HB (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined
    },
    { 
      key: 'standardkg', 
      label: 'Standard (kg)', 
      render: value => value && (value + ' kg'), 
      width: 105,
      parser: value => value ? parseFloat(value) : undefined
    },
    { 
      key: 'volume_charge', 
      label: 'Volume Charge', 
      render: value => value && (DEFAULT_SYMBOL + value), 
      width: 115,
      parser: (_, record) => (record.standardkg ? parseFloat(record.standardkg) : 0) - (record.hbkg ? parseFloat(record.hbkg) : 0)
    }
  ],
  MarkingTableDetails: () => (
    <Container>
      <TotalQuantity />
      <RealDifference />
      <TotalList />
      <MasterDifference />
      <TotalHB />
    </Container>
  )
};

export default markingsStuff;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;
