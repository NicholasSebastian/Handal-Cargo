import { FC } from "react";
import styled from "styled-components";
import {} from "antd";
import TableTemplate from "../../../components/compounds/TableTemplate";

const AirCargo: FC = () => {
  return (
    <TableTemplate // TODO: Refer to the SeaFreight components. They're pretty much almost identical. 
      collectionName="AirCargo"
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
      form={[
        { key: 'name', label: 'Nama' }
      ]} />
  );
}

export default AirCargo;

const ViewContainer = styled.div`
  // TODO
`;
