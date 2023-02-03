import { FC } from "react";
import styled from "styled-components";
import TableTemplate from "../../../components/compounds/TableTemplate";
import createDependentValue from "../../../components/basics/DependentValue";
import { formatCurrency } from "../../../utils";
import MarkingTable from "./MarkingTable";

// TODO: Add a Surat Jalan table to view all Surat Jalan, including an Advanced Search feature, 
//       whether it gets its own page, or just a modal accessible through this page.
// TODO: The items on the table should be clickable to view their details, alongside the 'Print' button.
// TODO: The table should have 'Print SJ' and 'Print SJ Daerah' buttons on the right for each row.

// TODO: Add a Faktur table to view all Faktur, including an Advanced Search feature, 
//       whether it gets its own page, or just a modal accessible through this page.
// TODO: The items on the table should be clickable to view their details, alongside the 'Print' button.
// TODO: The table should have 'Print' buttons on the right for each row.

// NOTE: If you're going to make whole dedicated pages for these, consider separating them by 'Sea Freight' or 'Air Cargo'.

const SeaFreight: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="SeaFreight"
      modalWidth={720}
      columns={[
        { dataIndex: "", title: "" }
        // TODO: Display an indicator to signify if all the markings in the container is already paid for.
      ]}
      view={props => {
        const { values } = props;
        // TODO: Have state here to determine which of the different pages to display.
        return (
          <ViewContainer>
            {/* TODO: Display all the fields, including the table of markings. */}
            {/* TODO: Each row of the Marking table should have a 'Surat Jalan' button and a 'Faktur' button. */}
            {/* TODO: A 'Laporan Rugi Laba' button. */}
          </ViewContainer>
          // TODO: The Surat Jalan print preview page should be an editable form with all the values pre-filled
          //       and includes additional fields such as:
          //       - Quantity Kirim (Will be used to calculate the 'sisa' field)
          //       - M3/Kg (Idk, you gotta ask Ifat for clarification)
          // TODO: 'Simpan' button to save to the 'TravelDocuments' collection.
          // TODO: 'Simpan dan Print' button alongside a Select component for 'Surat Jalan' or 'Surat Jalan Daerah'.

          // TODO: The Faktur print preview page should be an editable form with all the values pee-filled and
          //       includes additional fields such as:
          //       - Total (Uneditable field, calculated by M3/Kg * Harga)
          // TODO: 'Simpan' button to save to the 'Invoices' collection.
          // TODO: 'Simpan dan Print' button.

          // TODO: The Laporan Rugi Laba print preview page. (Idk, you gotta ask Ifat for clarification)
        );
      }}
      form={[
        { key: 'container_number', label: 'Nomor Container', required: true },
        { key: 'muat_date', label: 'Tanggal Muat', type: 'date' },
        { key: 'arrival_date', label: 'Tanggal Tiba', type: 'date' },
        { key: 'bl_date', label: 'Tanggal BL', type: 'date' },
        { type: 'custom', render: createDependentValue({
          label: 'Hari Tiba Dari Muat',
          dependencies: ['arrival_date', 'muat_date'], 
          calculateValue: fields => fields.arrival_date?.diff(fields.muat_date, "days"), 
          defaultValue: 0,
          suffix: 'hari'
        })},
        { key: 'container_group', label: 'Kelompok Container', type: 'select', items: 'ContainerGroups' },
        { key: 'shipper', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'handler', label: 'Pengurus', type: 'select', items: 'Handlers' },
        'pagebreak',
        { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies', required: true },
        { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1, required: true },
        { key: 'clearance_fee', label: 'Biaya Custom Clearance', type: 'currency', defaultValue: 0, required: true },
        { key: 'muat_fee', label: 'Biaya Muat', type: 'currency', defaultValue: 0, required: true },
        { type: 'custom', render: createDependentValue({
          label: 'Biaya Muat (Rp.)',
          dependencies: ['muat_fee', 'exchange_rate'],
          calculateValue: fields => formatCurrency((fields.muat_fee * fields.exchange_rate).toString()),
          defaultValue: 0,
          prefix: 'Rp.'
        })},
        { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0, required: true },
        { type: 'custom', render: createDependentValue({
          label: 'Biaya Tambahan (Rp.)',
          dependencies: ['additional_fee', 'exchange_rate'],
          calculateValue: fields => formatCurrency((fields.additional_fee * fields.exchange_rate).toString()),
          defaultValue: 0,
          prefix: 'Rp.'
        })},
        { key: 'other_fee', label: 'Biaya Lain-Lain', type: 'currency', defaultValue: 0, required: true },
        { type: 'custom', render: createDependentValue({
          label: 'Biaya Lain-Lain (Rp.)',
          dependencies: ['other_fee', 'exchange_rate'],
          calculateValue: fields => formatCurrency((fields.other_fee * fields.exchange_rate).toString()),
          defaultValue: 0,
          prefix: 'Rp.'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Biaya (Rp.)',
          dependencies: ['muat_fee', 'additional_fee', 'other_fee'],
          calculateValue: fields => formatCurrency(((fields.muat_fee + fields.additional_fee + fields.other_fee) * fields.exchange_rate).toString()),
          defaultValue: 0,
          prefix: 'Rp.'
        })},
        'pagebreak',
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { type: 'custom', render: createDependentValue({
          label: 'Total Muatan',
          dependencies: ['markings'], // TODO: Fix this.
          calculateValue: fields => fields.markings.reduce((acc: number, marking: any) => acc + marking.quantity, 0),
          defaultValue: 0,
          suffix: 'Colly / Ball'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Kubikasi (List)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'm³'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Berat (List)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'Kg'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Kubikasi (DList)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'm³'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Berat (DList)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'Kg'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Kubikasi (HB)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'm³'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Berat (HB)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'Kg'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Kubikasi (Cust)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'm³'
        })},
        { type: 'custom', render: createDependentValue({
          label: 'Total Berat (Cust)',
          dependencies: ['markings'],
          calculateValue: fields => 0, // TODO
          defaultValue: 0,
          suffix: 'Kg'
        })},
        { key: 'description', label: 'Keterangan', type: 'textarea' },
      ]} />
  );
}

export default SeaFreight;

const ViewContainer = styled.div`
  // TODO
`;
