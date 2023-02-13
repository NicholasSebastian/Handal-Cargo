import { FC, Fragment } from "react";
import { Button, message } from "antd";
import moment from "moment";
import useDatabase from "../../../../data/useDatabase";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import BasicForm from "../../../../components/basics/BasicForm";
import createDependentValue from "../../../../components/basics/DependentValue";
import { IFormProps } from "../View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import DisplayTotal from "../../../../components/specialized/DisplayTotal";
import DataSetter from "../../../../components/specialized/DataSetter";
import print from "../../../../print";
import { momentsToDates, formatCurrency } from "../../../../utils";

const InvoiceForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  const handleSubmit = (submittedValues: any) => {
    database?.collection('Invoices')
      .insertOne(momentsToDates(submittedValues))
      .then(() => {
        message.success("Faktur telah disimpan.");
        closeModal();
        print(submittedValues, 'sf-faktur');
      })
      .catch(() => message.error("Error terjadi. Data gagal disimpan."));
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={11}
      items={[
        { key: 'user', label: 'User', disabled: true },
        { key: 'print_date', label: 'Tanggal Cetak', type: 'date', defaultValue: moment(), disabled: true },
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment() },
        { key: 'container_number', label: 'Nomor Container', required: true },
        { key: 'measurement_details', label: 'Keterangan Ukuran', disabled: true },
        { key: 'quantity', label: 'Kuantitas', type: 'number', required: true },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'two_various', label: '2 Various', type: 'boolean' },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'via_transfer', label: 'Via Transfer', type: 'boolean' },
        { key: 'product_detail', label: 'Keterangan Barang', type: 'select', items: 'ProductDetails' },
        { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
          items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
        },
        { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies' },
        { key: 'measurement', type: 'custom', render: InputMeasurement },
        { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1 },
        { key: 'price', label: 'Harga', type: 'currency', required: true, defaultValue: 0 },
        { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0 },
        { key: 'expedition', label: 'Expedisi', type: 'select',  items: 'Expeditions' },
        { 
          type: 'custom', 
          render: createDependentValue({
            label: "Biaya Tambahan (Rp)",
            dependencies: ['additional_fee', 'exchange_rate'],
            calculateValue: ([additional_fee, exchange_rate]) => {
              const value = additional_fee * exchange_rate;
              return formatCurrency(value.toString());
            },
            defaultValue: 0
          })
        },
        { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
        { key: 'shipment_fee', label: 'Ongkos Kirim', type: 'currency', defaultValue: 0 },
        { key: 'nb', label: 'NB', type: 'textarea' },
        { key: 'total', type: 'custom', render: DisplayTotal },
        { type: 'custom', render: DataSetter }
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
            htmlType="submit">
            Print Faktur
          </Button>
        </Fragment>
      } />
  );
}

export default InvoiceForm;
