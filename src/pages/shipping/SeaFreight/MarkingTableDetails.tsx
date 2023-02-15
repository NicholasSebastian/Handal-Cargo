import { FC } from "react";
import styled from "styled-components";
import createDependentValue from "../../../components/basics/DependentValue";

const valueDisplays = [
  { key: 'listm3', label: 'Total Kubikasi (List)', suffix: 'm³' },
  { key: 'listkg', label: 'Total Berat (List)', suffix: 'kg' },
  { key: 'dlistm3', label: 'Total Kubikasi (DList)', suffix: 'm³' },
  { key: 'dlistkg', label: 'Total Berat (DList)', suffix: 'kg' },
  { key: 'hbm3', label: 'Total Kubikasi (HB)', suffix: 'm³' },
  { key: 'hbkg', label: 'Total Berat (HB)', suffix: 'kg' },
  { key: 'custm3', label: 'Total Kubikasi (Cust)', suffix: 'm³' },
  { key: 'custkg', label: 'Total Berat (Cust)', suffix: 'kg' },
  { key: 'quantity', label: 'Total Muatan', suffix: 'Colly / Ball' }
]
.map(field => createDependentValue({
  label: field.label,
  labelSpan: 12,
  dependencies: ['markings'],
  calculateValue: ([markings]) => {
    return markings.reduce((acc: number, marking: any) => acc + (marking[field.key] ?? 0), 0);
  },
  defaultValue: 0,
  suffix: field.suffix
}));

const MarkingTableDetails: FC = () => (
  <Container>
    {valueDisplays.map(Display => <Display />)}
  </Container>
)

export default MarkingTableDetails

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;
