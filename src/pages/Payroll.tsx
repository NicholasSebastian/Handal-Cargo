import { FC } from "react";
import styled from "styled-components";
import { Alert } from "antd";

const Payroll: FC = () => {
  return (
    <Container>
      <Alert 
        type="warning" 
        message="Fitur ini masih dalam perencanaan." />
      {/* TODO */}
    </Container>
  );
}

export default Payroll;

const Container = styled.div`
  margin: 20px;
  // TODO
`;
