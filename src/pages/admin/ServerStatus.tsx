import { open } from '@tauri-apps/api/shell';
import { FC } from "react";
import styled from "styled-components";
import { Button } from "antd";

const MONGODB_REALM_URL = "";

const ServerStatus: FC = () => {
  return (
    <Container>
      <Button
        type="primary"
        onClick={() => open(MONGODB_REALM_URL)}>
        Dasbor Server
      </Button>
      {/* TODO */}
    </Container>
  );
}

export default ServerStatus;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  // TODO
`;
