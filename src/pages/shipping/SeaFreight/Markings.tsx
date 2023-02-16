import styled from "styled-components";
import createDependentValue from "../../../components/basics/DependentValue";
import { IMarkingsStuff } from "../../../components/compounds/ShippingTemplate";

const markingsStuff: IMarkingsStuff = {
  markingTableWidth: 1280,
  markingFields: [
    { 
      key: 'listm3', 
      label: 'List (m³)', 
      render: value => value && (value + ' m³'),
      parser: value => value ? parseFloat(value) : undefined
    },
    { 
      key: 'listkg', 
      label: 'List (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'dlistm3', 
      label: 'DList (m³)', 
      render: value => value && (value + ' m³'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'dlistkg', 
      label: 'DList (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'hbm3', 
      label: 'HB (m³)', 
      render: value => value && (value + ' m³'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'hbkg', 
      label: 'HB (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'custm3',
      label: 'Cust (m³)', 
      render: value => value && (value + ' m³'),
      parser: value => value ? parseFloat(value) : undefined 
    },
    { 
      key: 'custkg', 
      label: 'Cust (kg)', 
      render: value => value && (value + ' kg'),
      parser: value => value ? parseFloat(value) : undefined 
    }
  ],
  MarkingTableDetails: () => (
    <Container>
      {[
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
      }))
      .map(Display => (
        <Display />
      ))}
    </Container>
  )
};

export default markingsStuff;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;
