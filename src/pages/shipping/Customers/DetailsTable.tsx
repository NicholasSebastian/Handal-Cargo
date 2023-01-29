import { FC, useState } from "react";
import styled from "styled-components";
import { List, Input, Button } from "antd";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";

const DetailsTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  return (
    <DetailsContainer>
      <div>
        <Input placeholder="Keterangan Barang" />
        <Button>Add</Button>
      </div>
      <List />
    </DetailsContainer>
  );
}

export default DetailsTable;

const DetailsContainer = styled.div`
  > div:first-child {
    display: flex;
  }
`;

