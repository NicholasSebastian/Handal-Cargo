import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Button, Steps } from "antd";
import TableTemplate from "../../components/compounds/TableTemplate";

const { Item } = Form;
const { Step } = Steps;

const Customers: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Customers"
      searchBy="name"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            {/* TODO */}
          </ViewContainer>
        );
      }}
      form={props => {
        const { initialValues, onSubmit } = props;
        return (
          <FormContainer
            initialValues={initialValues}
            onFinish={onSubmit}
            labelCol={{ span: 7 }}>
            {/* TODO */}
          </FormContainer>
        );
      }} />
  );
}

export default Customers;

const ViewContainer = styled.div`
  // TODO
`;

const FormContainer = styled(Form)`
  // TODO
`;
