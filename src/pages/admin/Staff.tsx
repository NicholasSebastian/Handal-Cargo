import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";
import { dateToString } from "../../utils";

const Staff: FC = () => {
  return (
    <TableTemplate 
      collectionName="Staff"
      searchBy="name"
      excludeFromSearch={['status']}
      modalWidth={700}
      columns={[
        { dataIndex: 'name', title: 'Nama' },
        { dataIndex: 'access_level', title: 'Level Akses' },
        { dataIndex: 'staff_group', title: 'Kelompok Staff' },
        { dataIndex: 'status', title: 'Aktif', render: (value) => value ? 'Iya' : 'Tidak' }
      ]}
      view={[
        { key: 'username', label: 'Nama Pengguna' },
        { key: 'access_level', label: 'Level Akses' },
        { key: 'staff_group', label: 'Kelompok Staff' },
        { key: 'gender', label: 'Kelamin' },
        { key: 'address', label: 'Alamat' },
        { key: 'ward', label: 'Kecamatan' },
        { key: 'city', label: 'Kota' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'birthplace', label: 'Tempat Lahir' },
        { key: 'birthday', label: 'Tanggal Lahir', render: value => dateToString(value) },
        { key: 'salary', label: 'Gaji' },
        { key: 'overtime_pay', label: 'Lembur / Jam' },
        { key: 'allowance', label: 'Uang Makan' },
        { key: 'holiday_pay', label: 'THR' },
        { key: 'bonus', label: 'Uang Kerajinan' },
        { key: 'status', label: 'Aktif', render: value => value ? 'Aktif': 'Tidak Aktif' },
        { key: 'employment_date', label: 'Tanggal Kerja', render: value => dateToString(value) }
      ]}
      form={[
        { key: 'name', label: 'Nama', required: true },
        { key: 'username', label: 'Nama Pengguna', required: true },
        { key: 'password', label: 'Kata Sandi', type: 'password', required: true },
        { key: 'access_level', label: 'Level Akses', type: 'select', items: 'AccessLevels', required: true },
        { key: 'staff_group', label: 'Kelompok Staff', type: 'select', items: 'StaffGroups', required: true },
        { key: 'gender', label: 'Kelamin', type: 'select', items: ['Laki-laki', 'Perempuan'] },
        'pagebreak',
        { key: 'address', label: 'Alamat' },
        { key: 'ward', label: 'Kecamatan' },
        { key: 'city', label: 'Kota' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'birthplace', label: 'Tempat Lahir' },
        { key: 'birthday', label: 'Tanggal Lahir', type: 'date' },
        'pagebreak',
        { key: 'salary', label: 'Gaji', type: 'currency' },
        { key: 'overtime_pay', label: 'Lembur / Jam', type: 'currency' },
        { key: 'allowance', label: 'Uang Makan', type: 'currency' },
        { key: 'holiday_pay', label: 'THR', type: 'currency' },
        { key: 'bonus', label: 'Uang Kerajinan', type: 'currency' },
        { key: 'status', label: 'Aktif', type: 'boolean', required: true },
        { key: 'employment_date', label: 'Tanggal Kerja', type: 'date', required: true }
      ]} />
  );
}

export default Staff;
