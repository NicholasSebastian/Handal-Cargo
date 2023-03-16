import { Presets } from "./components/abstractions/usePrint";
import { DEFAULT_SYMBOL } from "./components/abstractions/useCurrencyHandling";
import { commaSeparate, dateToString } from "./utils";

type PrintLayouts = Record<Presets, (values: Record<string, any>) => Array<IPrintItem | IRect>>
type Titles = Record<Presets, string>;

interface IPrintItem {
  content: string
  x: number
  y: number
  prefix?: string
  suffix?: string
  color?: string
  size?: number
  bold?: number
  italic?: boolean
  underline?: boolean
  preserve?: boolean
}

interface IRect {
  x: number
  y: number
  width: number
  height: number
  color?: string
}

const layouts: PrintLayouts = {
  "sf-surat-jalan": data => [
    // Phone numbers at the top left.
    { content: data.phone_number, prefix: "Telp:", x: 168, y: 60 },
    { content: data.home_number, prefix: "Hp:", x: 168, y: 80 },

    // Measurement and Sea Freight information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 257 },
    { content: data.route, prefix: "Sea Freight:", x: 226, y: 257 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 272 },
    { content: data.container_number, prefix: "Nomor Container:", x: 226, y: 287 },

    // Customer information at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.customer, x: 527, y: 72 },
    { content: data.address, x: 527, y: 92 },
    { content: data.city, x: 527, y: (data.address && data.address.length > 50) ? 180 : 160 }
  ],
  "sf-surat-jalan-daerah": data => [
    // Company information at the top left.
    { content: data.company_data.name, prefix: "Sip.", x: 110, y: 45 },
    { content: data.company_data.address, x: 110, y: 60 },
    { content: data.company_data.phone_number, x: 110, y: 75 },
    
    // Measurement and Sea Freight information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 257 },
    { content: data.route, prefix: "Sea Freight:", x: 226, y: 257 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 272 },
    { content: data.container_number, prefix: "Nomor Container:", x: 226, y: 287 },

    // Customer information also at the bottom left.
    { content: "Untuk dikirim ke:", x: 226, y: 302 },
    { content: data.customer, x: 226, y: 317 },
    { content: data.address, x: 226, y: 332 },
    { content: data.city, x: 226, y: 377 },
    { content: data.phone_number, prefix: "Telp:", x: 226, y: 402 },
    { content: data.home_number, prefix: "Hp:", x: 226, y: 417 },

    // Phone number at the top right.
    { content: data.phone_number, prefix: "Telp:", x: 527, y: 74 }
  ],
  "sf-faktur": data => [
    // Document title at the top, invoice number at the top left, and transfer information at the top right.
    { content: "Invoice", x: 355, y: 40, size: 18, bold: 700, underline: true },
    { content: data._id.toString().substring(18), prefix: "No. Faktur:", x: 20, y: 20 },
    { content: data.via_transfer ? data.company_data?.via_transfer : '', x: 440, y: 20, preserve: true },

    // Customer information at the top left.
    { content: data.customer, x: 140, y: 100 },
    { content: "di", x: 140, y: 115 },
    { content: data.city, x: 140, y: 130 },

    // City, date, and shipper at the top right.
    { content: `${data.company_data.city}, ${dateToString(data.date)}`, x: 500, y: 100 },
    { content: data.carrier ?? '-', prefix: "Shipper:", x: 500, y: 140 },

    // All the stuff in the middle.
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 65, y: 250 },
    { content: `${data.route} (${data.quantity} φ)`, prefix: "Sea Freight", suffix: data.product_detail, x: 145, y: 250 },
    { content: commaSeparate(data.price * data.exchange_rate), prefix: DEFAULT_SYMBOL, x: 550, y: 250 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 670, y: 250 },
    { content: data.container_number, prefix: "Nomor Container:", x: 145, y: 275 },

    // The last row at the bottom.
    { content: data.marking, prefix: "Marking:", x: 145, y: 330 },
    { content: "TOTAL", x: 550, y: 330, bold: 600 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 670, y: 330 }
  ],
  "sf-rugi-laba": data => {
    const columns = [20, 120, 160, 220, 320, 470, 600, 680, 830, 970];
    const offsetY = 140 + data.invoices.length * 20;
    const totalMeasurement = data.invoices.reduce((acc: number, val: any) => acc + val.measurement, 0);
    const total = data.invoices.reduce((acc: number, val: any) => acc + val.total, 0);

    return [
      // Document title.
      { content: "Laporan Rugi Laba", x: 450, y: 20, size: 18, bold: 700, italic: true, color: '#004D52' },
      { content: "Handal Cargo", x: 480, y: 40, size: 18, bold: 700, color: '#004D52' },

      // The red stuff at the top left.
      { content: dateToString(data.arrival_date), prefix: "Tgl Tiba:", x: 20, y: 108, bold: 600, color: '#f00' },
      { content: data.container_number, prefix: "Nomor Container:", x: 20, y: 127, bold: 600, color: '#f00' },
      { content: commaSeparate(data.total_fee), prefix: `Total Biaya: ${DEFAULT_SYMBOL}`, x: 700, y: 127, bold: 600, color: '#f00' },

      // Header background.
      { x: 20, y: 80, width: 1080, height: 30 },
      { x: 20, y: 82, width: 1080, height: 1, color: '#fff' },
      { x: 20, y: 107, width: 1080, height: 1, color: '#fff' },

      // Header text.
      { content: "Marking", x: columns[0], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Qty", x: columns[1], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "m³/kg", x: columns[2], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Harga", x: columns[3], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Biaya Tambahan", x: columns[4], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Ongkos Kirim", x: columns[5], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Diskon", x: columns[6], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Biaya Lain-Lain", x: columns[7], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Total", x: columns[8], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Keterangan", x: columns[9], y: 87, size: 14, bold: 500, color: '#fff' },

      // Table content.
      ...data.invoices
        .map((invoice: any, i: number) => {
          const y = 148 + (20 * i);
          return [
            { content: invoice.marking, x: columns[0], y, size: 14 },
            { content: invoice.quantity, x: columns[1], y, size: 14 },
            { content: commaSeparate(invoice.measurement), x: columns[2], y, size: 14 },
            { content: commaSeparate(invoice.price * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[3], y, size: 14 },
            { content: commaSeparate(invoice.additional_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[4], y, size: 14 },
            { content: commaSeparate(invoice.shipment_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[5], y, size: 14 },
            { content: commaSeparate(invoice.discount), prefix: DEFAULT_SYMBOL, x: columns[6], y, size: 14 },
            { content: commaSeparate(invoice.other_fee), prefix: DEFAULT_SYMBOL, x: columns[7], y, size: 14 },
            { content: commaSeparate(invoice.total), prefix: DEFAULT_SYMBOL, x: columns[8], y, size: 14 },
            { content: invoice.description, x: columns[9], y, size: 14 }
          ];
        })
        .flat(),
      
      // Total Measurement, Margin, and Sub Total.
      { x: 225, y: offsetY + 12, width: 720, height: 1 },
      { content: commaSeparate(totalMeasurement), x: 160, y: offsetY + 12, size: 14 },
      { content: "Margin", x: 245, y: offsetY + 12, italic: true, color: '#f00', size: 14 },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 320, y: offsetY + 12, size: 14 },
      { content: "Sub Total", x: 725, y: offsetY + 12, italic: true, color: '#f00', size: 14 },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 830, y: offsetY + 12, size: 14 },

      // Margin and Grand Total.
      { x: 20, y: offsetY + 30, width: 1050, height: 1 },
      { content: "Margin", x: 245, y: offsetY + 30, italic: true, bold: 700, color: '#f00', size: 14 },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 320, y: offsetY + 30, bold: 700, size: 14 },
      { content: "Grand Total", x: 725, y: offsetY + 30, italic: true, bold: 700, color: '#f00', size: 14 },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 830, y: offsetY + 30, bold: 700, size: 14 }
    ];
  },
  "ac-surat-jalan": data => [
    // Phone numbers at the top left.
    { content: data.phone_number, prefix: "Telp:", x: 168, y: 60 },
    { content: data.home_number, prefix: "Hp:", x: 168, y: 80 },

    // Measurement and Air Cargo information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 257 },
    { content: data.item_code, x: 80, y: 277 },
    { content: data.route, prefix: "Air Cargo:", x: 226, y: 257 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 277 },

    // The last row at the bottom.
    { content: "Total", suffix: data.unit, x: 226, y: 300 },
    { content: data.quantity, suffix: data.unit, x: 326, y: 300 },
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 426, y: 300 },

    // Customer information at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.customer, x: 527, y: 72 },
    { content: data.address, x: 527, y: 92 },
    { content: data.city, x: 527, y: (data.address && data.address.length > 50) ? 180 : 160 }
  ],
  "ac-surat-jalan-daerah": data => [
    // Company information at the top left.
    { content: data.company_data.name, prefix: "Sip.", x: 110, y: 45 },
    { content: data.company_data.address, x: 110, y: 60 },
    { content: data.company_data.phone_number, x: 110, y: 75 },
    
    // Measurement and Air Cargo information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 257 },
    { content: data.item_code, x: 80, y: 277 },
    { content: data.route, prefix: "Air Cargo:", x: 226, y: 257 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 272 },

    // Customer information also at the middle.
    { content: `(${data.measurement}`, prefix: "Paket", suffix: `${data.measurement_option.substr(-3, 2)})`, x: 226, y: 302 },
    { content: "Untuk dikirim ke:", x: 226, y: 317 },
    { content: data.customer, x: 226, y: 332 },
    { content: data.address, x: 226, y: 347 },
    { content: data.city, x: 2226, y: 396 },
    { content: data.phone_number, prefix: "Telp:", x: 226, y: 416 },
    { content: data.home_number, prefix: "Hp:", x: 226, y: 431 },

    // Date and Phone number at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.phone_number, prefix: "Telp:", x: 527, y: 74 } // TODO
  ],
  "ac-faktur": data => [
    // Document title at the top, invoice number at the top left, and transfer information at the top right.
    { content: "Invoice", x: 355, y: 40, size: 18, bold: 700, underline: true },
    { content: data._id.toString().substring(18), prefix: "No. Faktur:", x: 20, y: 20 },
    { content: data.via_transfer ? data.company_data?.via_transfer : '', x: 440, y: 20, preserve: true },

    // Customer information at the top left.
    { content: data.customer, x: 140, y: 100 },
    { content: "di", x: 140, y: 115 },
    { content: data.city, x: 140, y: 130 },

    // City and date at the top right.
    { content: `${data.company_data.city}, ${dateToString(data.date)}`, x: 500, y: 100 },

    // All the stuff in the middle.
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 65, y: 250 },
    { content: `${data.route} (${data.quantity} φ)`, prefix: "Air Cargo", suffix: data.product_detail, x: 145, y: 250 },
    { content: commaSeparate(data.price * data.exchange_rate), prefix: DEFAULT_SYMBOL, x: 550, y: 250 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 670, y: 250 },
    { content: data.item_code, prefix: "Kode Barang:", x: 145, y: 275 },

    // The last row at the bottom.
    { content: data.marking, prefix: "Marking:", x: 145, y: 330 },
    { content: "TOTAL", x: 550, y: 330, bold: 600 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 670, y: 330 }
  ],
  "ac-rugi-laba": data => {
    const columns = [20, 85, 120, 180, 280, 390, 520, 650, 730, 880, 1000];
    const offsetY = 140 + data.invoices.length * 20;
    const totalMeasurement = data.invoices.reduce((acc: number, val: any) => acc + val.measurement, 0);
    const total = data.invoices.reduce((acc: number, val: any) => acc + val.total, 0);

    return [
      // Document title.
      { content: "Laporan Rugi Laba", x: 450, y: 20, size: 18, bold: 700, italic: true, color: '#004D52' },
      { content: "Handal Cargo", x: 480, y: 40, size: 18, bold: 700, color: '#004D52' },

      // The red stuff at the top left.
      { content: dateToString(data.arrival_date), prefix: "Tgl Tiba:", x: 20, y: 108, bold: 600, color: '#f00' },
      { content: data.item_code, prefix: "Kode Barang:", x: 20, y: 127, bold: 600, color: '#f00' },
      { content: commaSeparate(data.total_fee), prefix: `Total Biaya: ${DEFAULT_SYMBOL}`, x: 760, y: 127, bold: 600, color: '#f00' },

      // Header background.
      { x: 20, y: 80, width: 1080, height: 30 },
      { x: 20, y: 82, width: 1080, height: 1, color: '#fff' },
      { x: 20, y: 107, width: 1080, height: 1, color: '#fff' },

      // Header text.
      { content: "Marking", x: columns[0], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Qty", x: columns[1], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "m³/kg", x: columns[2], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Harga", x: columns[3], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Vol. Charge", x: columns[4], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Biaya Tambahan", x: columns[5], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Ongkos Kirim", x: columns[6], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Diskon", x: columns[7], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Biaya Lain-Lain", x: columns[8], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Total", x: columns[9], y: 87, size: 14, bold: 500, color: '#fff' },
      { content: "Keterangan", x: columns[10], y: 87, size: 14, bold: 500, color: '#fff' },

      // Table content.
      ...data.invoices
        .map((invoice: any, i: number) => {
          const y = 148 + (20 * i);
          return [
            { content: invoice.marking, x: columns[0], y, size: 14 },
            { content: invoice.quantity, x: columns[1], y, size: 14 },
            { content: commaSeparate(invoice.measurement), x: columns[2], y, size: 14 },
            { content: commaSeparate(invoice.price * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[3], y, size: 14 },
            { content: commaSeparate(invoice.volume_charge * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[4], y, size: 14 },
            { content: commaSeparate(invoice.additional_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[5], y, size: 14 },
            { content: commaSeparate(invoice.shipment_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[6], y, size: 14 },
            { content: commaSeparate(invoice.discount), prefix: DEFAULT_SYMBOL, x: columns[7], y, size: 14 },
            { content: commaSeparate(invoice.other_fee), prefix: DEFAULT_SYMBOL, x: columns[8], y, size: 14 },
            { content: commaSeparate(invoice.total), prefix: DEFAULT_SYMBOL, x: columns[9], y, size: 14 },
            { content: invoice.description, x: columns[10], y, size: 14 }
          ];
        })
        .flat(),
      
      // Total Measurement, Margin, and Sub Total.
      { x: 180, y: offsetY + 12, width: 810, height: 1 },
      { content: commaSeparate(totalMeasurement), x: 120, y: offsetY + 12, size: 14 },
      { content: "Margin", x: 245, y: offsetY + 12, italic: true, color: '#f00', size: 14 },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 320, y: offsetY + 12, size: 14 },
      { content: "Sub Total", x: 775, y: offsetY + 12, italic: true, color: '#f00', size: 14 },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 880, y: offsetY + 12, size: 14 },

      // Margin and Grand Total.
      { x: 20, y: offsetY + 30, width: 1070, height: 1 },
      { content: "Margin", x: 245, y: offsetY + 30, italic: true, bold: 700, color: '#f00', size: 14 },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 320, y: offsetY + 30, bold: 700, size: 14 },
      { content: "Grand Total", x: 775, y: offsetY + 30, italic: true, bold: 700, color: '#f00', size: 14 },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 880, y: offsetY + 30, bold: 700, size: 14 }
    ];
  }
};

const titles: Titles = {
  "sf-surat-jalan-daerah": "Surat Jalan Daerah Sea Freight",
  "sf-surat-jalan": "Surat Jalan Sea Freight",
  "sf-faktur": "Faktur Sea Freight",
  "sf-rugi-laba": "Laporan Rugi Laba Sea Freight",
  "ac-surat-jalan-daerah": "Surat Jalan Daerah Air Cargo",
  "ac-surat-jalan": "Surat Jalan Air Cargo",
  "ac-faktur": "Faktur Air Cargo",
  "ac-rugi-laba": "Laporan Rugi Laba Air Cargo"
};

export { titles };
export default layouts;
