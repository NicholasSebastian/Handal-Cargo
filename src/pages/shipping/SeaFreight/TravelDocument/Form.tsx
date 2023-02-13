import { FC, Fragment, useRef } from "react";
import { Button, message } from "antd";
import moment from "moment";
import useDatabase from "../../../../data/useDatabase";
import BasicForm from "../../../../components/basics/BasicForm";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import { IFormProps } from "../View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import CustomerFetcher from "../../../../components/specialized/CustomerFetcher";
import print from "../../../../print";
import { momentsToDates } from "../../../../utils";

const TravelDocumentForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();
  const isDaerahType = useRef<boolean>();

  const handleSubmit = (submittedValues: any) => {
    database?.collection('TravelPermits')
      .insertOne(momentsToDates(submittedValues))
      .then(() => {
        message.success("Surat Jalan telah disimpan.");
        closeModal();

        // Proceed to the printing process.
        const preset = isDaerahType.current ? 'sf-surat-jalan-daerah' : 'sf-surat-jalan';
        print(submittedValues, preset);
      })
      .catch(() => message.error("Error terjadi. Data gagal disimpan."));
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={11}
      items={[
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment(), required: true },
        { key: 'container_number', label: 'Nomor Container', disabled: true },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'quantity', label: 'Kuantitas Kirim', type: 'number', required: true },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
          items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
        },
        { key: 'expedition', label: 'Expedisi', type: 'select', items: 'Expeditions' },
        { key: 'measurement', type: 'custom', render: InputMeasurement },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'unit', label: 'Satuan', type: 'select', 
          items: ['Colly', 'Ball', 'Roll', 'Kardus', 'Pcs', 'Kodi', 'Lusin'] 
        },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'customer', label: 'Customer' }, 
        { key: 'city', label: 'Kota' },
        { key: 'address', label: 'Alamat', type: 'textarea' },
        { key: 'description', label: 'Keterangan Kirim', type: 'textarea' },
        { type: 'custom', render: CustomerFetcher }
      ]}
      customButton={
        <Fragment>
          <Button 
            htmlType="button"
            onClick={() => setCurrentPage('default')}>
            Kembali
          </Button>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { isDaerahType.current = false }}>
            Print Surat Jalan
          </Button>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { isDaerahType.current = true }}>
            Print Surat Jalan Daerah
          </Button>
        </Fragment>
      } />
  );
}

export default TravelDocumentForm;
