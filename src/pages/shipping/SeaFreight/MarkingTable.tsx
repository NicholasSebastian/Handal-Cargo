import { FC } from "react";
import styled from "styled-components";
import { Form, Table, Input } from "antd";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";

const { useFormInstance } = Form;

// TODO: The input for the 'Marking' field should reference all the 'markings' under 'Customers'.

// TODO: The marking table for SeaFrieght should have editable fields originally, such as DList, HB, etc.
//       But instead, just add all the fields alongside the other input fields to make them settable from the get go.

// TODO: The 'Lunas' column should display true/false, signifying whether the marking has been paid for through Entri Faktur.
// TODO: The 'Sisa' column should display an integer, signifying the quantity that has not been sent through Surat Jalan.
// TODO: The 'Surat Jalan' column should display an integer, signifying the number of surat jalan that has been made.
// TODO: The 'Faktur' column should display an integer, signifying the number of faktur (invoices) that has been made.

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();
  
  return (
    <Container>
      <div>
        <Input placeholder="Marking" /* TODO: Make this select from Customer markings. */ />
        <Input placeholder="Quantity" />
        <Input placeholder="List (m³)" />
        <Input placeholder="List (Kg)" />
      </div>
      <Table
        size="small"
        pagination={false}
        dataSource={undefined} // TODO
        columns={[]} />
    </Container>
  );
}

export default MarkingTable;

const Container = styled.div`
  > div:first-child {
    display: flex;
    justify-content: space-between;
  }
`;
