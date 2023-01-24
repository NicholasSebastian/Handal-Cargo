import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Staff: FC = () => {
  return (
    <TableTemplate 
      collectionName="Staff"
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
        { key: 'birthday', label: 'Tanggal Lahir' },
        { key: 'salary', label: 'Gaji' },
        { key: 'overtime_pay', label: 'Lembur / Jam' },
        { key: 'allowance', label: 'Uang Makan' },
        { key: 'holiday_pay', label: 'THR' },
        { key: 'bonus', label: 'Uang Kerajinan' },
        { key: 'status', label: 'Aktif' },
        { key: 'employment_date', label: 'Tanggal Kerja' }
      ]}
      form={[
        { key: 'name', label: 'Nama' },
        { key: 'username', label: 'Nama Pengguna' },
        { key: 'password', label: 'Kata Sandi', type: 'password' },
        { key: 'access_level', label: 'Level Akses', type: 'select', items: 'AccessLevels' },
        { key: 'staff_group', label: 'Kelompok Staff', type: 'select', items: 'StaffGroups' },
        { key: 'gender', label: 'Kelamin', type: 'select', items: ['Laki-laki', 'Perempuan'] },
        { key: 'address', label: 'Alamat', required: false },
        { key: 'ward', label: 'Kecamatan', required: false },
        { key: 'city', label: 'Kota', required: false },
        { key: 'home_number', label: 'Nomor Telepon', required: false },
        { key: 'phone_number', label: 'Nomor HP', required: false },
        { key: 'birthplace', label: 'Tempat Lahir', required: false },
        { key: 'birthday', label: 'Tanggal Lahir', type: 'date', required: false },
        'pagebreak',
        { key: 'salary', label: 'Gaji', type: 'currency', required: false },
        { key: 'overtime_pay', label: 'Lembur / Jam', type: 'currency', required: false },
        { key: 'allowance', label: 'Uang Makan', type: 'currency', required: false },
        { key: 'holiday_pay', label: 'THR', type: 'currency', required: false },
        { key: 'bonus', label: 'Uang Kerajinan', type: 'currency', required: false },
        { key: 'status', label: 'Aktif', type: 'boolean' },
        { key: 'employment_date', label: 'Tanggal Kerja', type: 'date' }
      ]} />
  );
}

export default Staff;
