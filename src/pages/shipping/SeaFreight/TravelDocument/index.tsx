import { FC } from "react";
import styled from "styled-components";
import useDatabase from "../../../../data/useDatabase";

// TODO: New a Surat Jalan table to view all Surat Jalan, including an Advanced Search feature, 
//       whether it gets its own page, or just a modal accessible through this page.
// TODO: The items on the table should be clickable to view their details, alongside the 'Print' button.
// TODO: The table should have 'Print SJ' and 'Print SJ Daerah' buttons on the right for each row.

const TravelDocument: FC = () => {
  const database = useDatabase();

  return (
    <Container>{}</Container>
  );
}

export default TravelDocument;

const Container = styled.div`
  // TODO
`;
