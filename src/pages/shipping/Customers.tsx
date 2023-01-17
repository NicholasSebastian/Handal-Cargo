import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Button, Steps } from "antd";
import { IInjectedProps as ViewProps } from "../../components/abstracts/withInitialData";
import { IInjectedProps as FormProps } from "../../components/abstracts/withFormHandling";
import TableTemplate from "../../components/compounds/TableTemplate";

const { Item } = Form;
const { Step } = Steps;

const CustomersView: FC<ViewProps> = props => {
  const { values } = props;
  return (
    <ViewContainer>
      {/* TODO */}
    </ViewContainer>
  );
}

const CustomersForm: FC<FormProps> = props => {
  const { initialValues, onSubmit } = props;
  return (
    <FormContainer>
      {/* TODO */}
    </FormContainer>
  );
}

const Customers: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Customers"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={CustomersView}
      form={CustomersForm} />
  );
}

export default Customers;

const ViewContainer = styled.div`
  // TODO
`;

const FormContainer = styled(Form)`
  // TODO
`;
