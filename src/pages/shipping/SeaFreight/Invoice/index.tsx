import { FC } from "react";
import styled from "styled-components";
import useDatabase from "../../../../data/useDatabase";

// TODO: Add a Faktur table to view all Faktur, including an Advanced Search feature, 
//       whether it gets its own page, or just a modal accessible through this page.
// TODO: The items on the table should be clickable to view their details, alongside the 'Print' button.
// TODO: The table should have 'Print' buttons on the right for each row.

const Invoice: FC = () => {
  const database = useDatabase();

  return (
    <Container>{}</Container>
  );
}

export default Invoice;

const Container = styled.div`
  // TODO
`;
