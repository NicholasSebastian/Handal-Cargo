import { FC } from "react";
import styled from "styled-components";
import {} from "antd";
import TableTemplate from "../../components/compounds/TableTemplate";

const SeaFreight: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="SeaFreight"
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
        { key: 'name', label: 'Nama' },
        { type: 'custom', render: () => (
          <div>test component</div>
        )}
      ]} />
  );
}

export default SeaFreight;

const ViewContainer = styled.div`
  // TODO
`;
