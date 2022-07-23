import { FC } from "react";
import TableTemplate from "../../components/TableTemplate";

const Staff: FC = () => {
  return (
    <TableTemplate 
      collectionName="Staff"
      columns={[
        { dataIndex: 'username', title: 'Nama Pengguna' }
        // TODO
      ]}
      viewItems={[
        { key: 'username', label: 'Nama Pengguna' }
        // TODO
      ]}
      form={{
        nameLabel: 'Nama',
        items: [
          { key: 'username', label: 'Nama Pengguna' },
          { key: 'password', label: 'Kata Sandi', type: 'password' },
          { key: 'access_level', label: 'Level Akses', type: 'select', items: 'AccessLevels' },
          // TODO
        ]
      }} />
  );
}

export default Staff;
