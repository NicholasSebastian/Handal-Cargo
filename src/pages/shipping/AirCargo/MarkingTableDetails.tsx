import { FC } from "react";
import styled from "styled-components";
import createDependentValue from "../../../components/basics/DependentValue";

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
    return markings.reduce((acc: number, marking: any) => acc + marking[field.key], 0);
  },
  defaultValue: 0,
  suffix: 'kg'
}));

const RealDifference = createDependentValue({
  label: "Selisih Asli",
  labelSpan: 12,
  dependencies: ['markings'],
  calculateValue: ([markings]) => {
    const totalHB = markings.reduce((acc: number, marking: any) => acc + marking.hbkg, 0);
    const totalList = markings.reduce((acc: number, marking: any) => acc + marking.listkg, 0);
    return totalHB - totalList;
  },
  defaultValue: 0,
  suffix: 'kg'
});

const MasterDifference = createDependentValue({
  label: "Selisih Master",
  labelSpan: 12,
  dependencies: ['markings', 'clearance_weight'],
  calculateValue: ([markings, clearance_weight]) => {
    const totalHB = markings.reduce((acc: number, marking: any) => acc + marking.hbkg, 0);
    return totalHB - clearance_weight;
  },
  defaultValue: 0,
  suffix: 'kg'
});

const MarkingTableDetails: FC = () => {
  return (
    <Container>
      <TotalQuantity />
      <RealDifference />
      <TotalList />
      <MasterDifference />
      <TotalHB />
    </Container>
  )
}

export default MarkingTableDetails;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;
