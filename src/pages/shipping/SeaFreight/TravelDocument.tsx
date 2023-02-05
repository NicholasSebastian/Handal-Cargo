import { FC } from "react";
import { Form, Input } from "antd";
import moment from "moment";
import { IPageProps } from "./View";
import BasicForm from "../../../components/basics/BasicForm";

const { Item, useFormInstance, useWatch } = Form;

// TODO: The Surat Jalan print preview page should be an editable form with all the values pre-filled
//       and includes additional fields such as:
//       - Quantity Kirim (Will be used to calculate the 'sisa' field)
//       - M3/kg (Idk, you gotta ask Ifat for clarification)
// TODO: 'Simpan' button to save to the 'TravelDocuments' collection.
// TODO: 'Simpan dan Print' button alongside a Select component for 'Surat Jalan' or 'Surat Jalan Daerah'.

const TravelDocument: FC<IPageProps> = props => {
  const { values } = props;

  const handleSubmit = (values: any) => {
    // TODO
    // TODO: Deduct the sisa from the SeaFreight marking by the kuantitas kirim.
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={10}
      buttonLabel="Simpan dan Print"
      formItems={[
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'tanggal', label: 'Tanggal', type: 'date', defaultValue: moment() },
        { key: 'container_number', label: 'Nomor Container', disabled: true },
        { key: 'description', label: 'Keterangan Kirim' },
        { key: 'remainder', label: 'Kuantitas Kirim', type: 'number' },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'measurement', label: 'Pilihan Ukuran', type: 'select', items: ['Kubikasi (m³)', 'Berat (kg)'] },
        { 
          key: 'm3kg', 
          type: 'custom', 
          render: props => {
            const { value } = props;
            const form = useFormInstance();
            const measurement = useWatch('measurement', form);
            return (
              <Item 
                label={measurement ?? 'Kubikasi/Berat'} 
                labelCol={{ span: 10 }} 
                style={{ marginBottom: 0 }}>
                <Input 
                  value={value} // Very memory inefficient way to handle the onChange but oh well.
                  onChange={e => form.setFieldsValue({ ...form.getFieldsValue(true), m3kg: e.target.value })} />
              </Item>
            );
          } 
        },
        { key: 'unit', label: 'Satuan', type: 'select', items: ['Colly'] },
        { key: 'expedition', label: 'Expedisi', type: 'select', items: 'Expeditions' },
        // TODO: Get the customer this marking belongs to and pre-fill the details below.
        { key: 'customer', label: 'Customer' }, 
        { key: 'address', label: 'Alamat' },
        { key: 'city', label: 'Kota' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'phone_number', label: 'Nomor HP' }
      ]} />
  );
}

export default TravelDocument;
