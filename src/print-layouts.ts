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
    { content: data.measurement, suffix: data.unit, x: 80, y: 237 },
    { content: data.route, prefix: "Sea Freight:", x: 226, y: 237 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 257 },
    { content: data.container_number, prefix: "Nomor Container:", x: 226, y: 277 },

    // Customer information at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.customer, x: 527, y: 92 },
    { content: data.address, x: 455, y: 116 },
    { content: data.city, x: 455, y: (data.address && data.address.length > 50) ? 160 : 140 }
  ],
  "sf-surat-jalan-daerah": data => [
    // Company information at the top left.
    { content: data.company_data.name, prefix: "Sip.", x: 110, y: 45 },
    { content: data.company_data.address, x: 110, y: 60 },
    { content: data.company_data.phone_number, x: 110, y: 75 },
    
    // Measurement and Sea Freight information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 60, y: 160 },
    { content: data.route, prefix: "Sea Freight:", x: 160, y: 160 },
    { content: data.marking, prefix: "Marking:", x: 160, y: 175 },
    { content: data.container_number, prefix: "Nomor Container:", x: 160, y: 190 },

    // Customer information also at the bottom left.
    { content: "Untuk dikirim ke:", x: 160, y: 210 },
    { content: data.customer, x: 160, y: 225 },
    { content: data.address, x: 160, y: 240 },
    { content: data.city, x: 160, y: 255 },
    { content: data.phone_number, prefix: "Telp:", x: 160, y: 270 },
    { content: data.home_number, prefix: "Hp:", x: 160, y: 285 },

    // Phone number at the top right.
    { content: data.phone_number, prefix: "Telp:", x: 440, y: 110 }
  ],
  "sf-faktur": data => [
    // Document title at the top, invoice number at the top left, and transfer information at the top right.
    { content: "Invoice", x: 285, y: 40, size: 18, bold: 700, underline: true },
    { content: data._id, prefix: "No. Faktur:", x: 20, y: 20 },
    { content: data.via_transfer ? data.company_data?.via_transfer : '', x: 440, y: 20, preserve: true },

    // Customer information at the top left.
    { content: data.customer, x: 140, y: 100 },
    { content: "di", x: 140, y: 115 },
    { content: data.city, x: 140, y: 130 },

    // City, date, and shipper at the top right.
    { content: `${data.company_data.city}, ${dateToString(data.date)}`, x: 430, y: 100 },
    { content: data.carrier ?? '-', prefix: "Shipper:", x: 430, y: 115 },

    // All the stuff in the middle.
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 65, y: 200 },
    { content: `${data.route} (${data.quantity} φ)`, prefix: "Sea Freight", suffix: data.product_detail, x: 145, y: 200 },
    { content: commaSeparate(data.price * data.exchange_rate), prefix: DEFAULT_SYMBOL, x: 430, y: 200 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 200 },
    { content: data.container_number, prefix: "Nomor Container:", x: 145, y: 225 },

    // The last row at the bottom.
    { content: data.marking, prefix: "Marking:", x: 145, y: 280 },
    { content: "TOTAL", x: 450, y: 280, bold: 600 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 280 }
  ],
  "sf-rugi-laba": data => {
    const columns = [20, 120, 160, 220, 300, 400, 500, 580, 680, 780];
    const offsetY = 140 + data.invoices.length * 20;
    const totalMeasurement = data.invoices.reduce((acc: number, val: any) => acc + val.measurement, 0);
    const total = data.invoices.reduce((acc: number, val: any) => acc + val.total, 0);

    return [
      // Document title.
      { content: "Laporan Rugi Laba", x: 380, y: 20, size: 18, bold: 700, italic: true, color: '#004D52' },
      { content: "Handal Cargo", x: 400, y: 40, size: 18, bold: 700, color: '#004D52' },

      // The red stuff at the top left.
      { content: dateToString(data.arrival_date), prefix: "Tgl Tiba:", x: 20, y: 108, bold: 600, color: '#f00' },
      { content: data.container_number, prefix: "Nomor Container:", x: 40, y: 122, bold: 600, color: '#f00' },
      { content: commaSeparate(data.total_fee), prefix: `Total Biaya: ${DEFAULT_SYMBOL}`, x: 550, y: 122, bold: 600, color: '#f00' },

      // Header background.
      { x: 20, y: 80, width: 850, height: 25 },
      { x: 20, y: 82, width: 850, height: 1, color: '#fff' },
      { x: 20, y: 102, width: 850, height: 1, color: '#fff' },

      // Header text.
      { content: "Marking", x: columns[0], y: 87, bold: 500, color: '#fff' },
      { content: "Qty", x: columns[1], y: 87, bold: 500, color: '#fff' },
      { content: "m³/kg", x: columns[2], y: 87, bold: 500, color: '#fff' },
      { content: "Harga", x: columns[3], y: 87, bold: 500, color: '#fff' },
      { content: "Biaya Tambahan", x: columns[4], y: 87, bold: 500, color: '#fff' },
      { content: "Ongkos Kirim", x: columns[5], y: 87, bold: 500, color: '#fff' },
      { content: "Diskon", x: columns[6], y: 87, bold: 500, color: '#fff' },
      { content: "Biaya Lain-Lain", x: columns[7], y: 87, bold: 500, color: '#fff' },
      { content: "Total", x: columns[8], y: 87, bold: 500, color: '#fff' },
      { content: "Keterangan", x: columns[9], y: 87, bold: 500, color: '#fff' },

      // Table content.
      ...data.invoices
        .map((invoice: any, i: number) => {
          const y = 140 + (20 * i);
          return [
            { content: invoice.marking, x: columns[0], y },
            { content: invoice.quantity, x: columns[1], y },
            { content: commaSeparate(invoice.measurement), x: columns[2], y },
            { content: commaSeparate(invoice.price * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[3], y },
            { content: commaSeparate(invoice.additional_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[4], y },
            { content: commaSeparate(invoice.shipment_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[5], y },
            { content: commaSeparate(invoice.discount), prefix: DEFAULT_SYMBOL, x: columns[6], y },
            { content: commaSeparate(invoice.other_fee), prefix: DEFAULT_SYMBOL, x: columns[7], y },
            { content: commaSeparate(invoice.total), prefix: DEFAULT_SYMBOL, x: columns[8], y },
            { content: invoice.description, x: columns[9], y }
          ];
        })
        .flat(),
      
      // Total Measurement, Margin, and Sub Total.
      { x: 245, y: offsetY, width: 625, height: 1 },
      { content: commaSeparate(totalMeasurement), x: 160, y: offsetY + 6 },
      { content: "Margin", x: 245, y: offsetY + 6, italic: true, color: '#f00' },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 300, y: offsetY + 6 },
      { content: "Sub Total", x: 595, y: offsetY + 6, italic: true, color: '#f00' },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 680, y: offsetY + 6 },

      // Margin and Grand Total.
      { x: 20, y: offsetY + 22, width: 850, height: 1 },
      { content: "Margin", x: 245, y: offsetY + 28, italic: true, bold: 700, color: '#f00' },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 300, y: offsetY + 28, bold: 700 },
      { content: "Grand Total", x: 595, y: offsetY + 28, italic: true, bold: 700, color: '#f00' },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 680, y: offsetY + 28, bold: 700 }
    ];
  },
  "ac-surat-jalan": data => [
    // Phone numbers at the top left.
    { content: data.phone_number, prefix: "Telp:", x: 168, y: 60 },
    { content: data.home_number, prefix: "Hp:", x: 168, y: 80 },

    // Measurement and Air Cargo information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 237 },
    { content: data.item_code, x: 80, y: 257 },
    { content: data.route, prefix: "Air Cargo:", x: 226, y: 237 },
    { content: data.marking, prefix: "Marking:", x: 226, y: 257 },

    // The last row at the bottom.
    { content: "Total", suffix: data.unit, x: 226, y: 300 },
    { content: data.quantity, suffix: data.unit, x: 326, y: 300 },
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 426, y: 300 },

    // Customer information at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.customer, x: 527, y: 92 },
    { content: data.address, x: 455, y: 116 },
    { content: data.city, x: 455, y: (data.address && data.address.length > 50) ? 160 : 140 }
  ],
  "ac-surat-jalan-daerah": data => [
    // Company information at the top left.
    { content: data.company_data.name, prefix: "Sip.", x: 168, y: 40 },
    { content: data.company_data.address, x: 168, y: 60 },
    { content: data.company_data.phone_number, x: 168, y: 80 },
    
    // Measurement and Air Cargo information at the bottom left.
    { content: data.measurement, suffix: data.unit, x: 80, y: 237 },
    { content: data.item_code, x: 80, y: 257 },
    { content: data.route, prefix: "Air Cargo:", x: 80, y: 277 },
    { content: data.marking, prefix: "Marking:", x: 80, y: 297 },

    // Customer information also at the middle.
    { content: `(${data.measurement}`, prefix: "Paket", suffix: `${data.measurement_option.substr(-3, 2)})`, x: 240, y: 165 },
    { content: "Untuk dikirim ke:", x: 240, y: 180 },
    { content: data.customer, x: 240, y: 195 },
    { content: data.address, x: 240, y: 210 },
    { content: data.city, x: 240, y: 225 },
    { content: data.phone_number, prefix: "Telp:", x: 240, y: 240 },
    { content: data.home_number, prefix: "Hp:", x: 240, y: 255 },

    // Date and Phone number at the top right.
    { content: dateToString(data.date), x: 527, y: 44 },
    { content: data.phone_number, prefix: "Telp:", x: 440, y: 110 } // TODO
  ],
  "ac-faktur": data => [
    // Document title at the top, invoice number at the top left, and transfer information at the top right.
    { content: "Invoice", x: 285, y: 40, size: 18, bold: 700, underline: true },
    { content: data._id, prefix: "No. Faktur:", x: 20, y: 20 },
    { content: data.via_transfer ? data.company_data?.via_transfer : '', x: 440, y: 20, preserve: true },

    // Customer information at the top left.
    { content: data.customer, x: 140, y: 100 },
    { content: "di", x: 140, y: 115 },
    { content: data.city, x: 140, y: 130 },

    // City and date at the top right.
    { content: `${data.company_data.city}, ${dateToString(data.date)}`, x: 430, y: 100 },

    // All the stuff in the middle.
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 65, y: 200 },
    { content: `${data.route} (${data.quantity} φ)`, prefix: "Air Cargo", suffix: data.product_detail, x: 145, y: 200 },
    { content: commaSeparate(data.price * data.exchange_rate), prefix: DEFAULT_SYMBOL, x: 430, y: 200 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 200 },
    { content: data.item_code, prefix: "Kode Barang:", x: 145, y: 225 },

    // The last row at the bottom.
    { content: data.marking, prefix: "Marking:", x: 145, y: 280 },
    { content: "TOTAL", x: 450, y: 280, bold: 600 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 280 }
  ],
  "ac-rugi-laba": data => {
    const columns = [20, 80, 120, 180, 260, 340, 440, 540, 620, 720, 800];
    const offsetY = 140 + data.invoices.length * 20;
    const totalMeasurement = data.invoices.reduce((acc: number, val: any) => acc + val.measurement, 0);
    const total = data.invoices.reduce((acc: number, val: any) => acc + val.total, 0);

    return [
      // Document title.
      { content: "Laporan Rugi Laba", x: 380, y: 20, size: 18, bold: 700, italic: true, color: '#004D52' },
      { content: "Handal Cargo", x: 400, y: 40, size: 18, bold: 700, color: '#004D52' },

      // The red stuff at the top left.
      { content: dateToString(data.arrival_date), prefix: "Tgl Tiba:", x: 20, y: 108, bold: 600, color: '#f00' },
      { content: data.item_code, prefix: "Kode Barang:", x: 40, y: 122, bold: 600, color: '#f00' },
      { content: commaSeparate(data.total_fee), prefix: `Total Biaya: ${DEFAULT_SYMBOL}`, x: 580, y: 122, bold: 600, color: '#f00' },

      // Header background.
      { x: 20, y: 80, width: 850, height: 25 },
      { x: 20, y: 82, width: 850, height: 1, color: '#fff' },
      { x: 20, y: 102, width: 850, height: 1, color: '#fff' },

      // Header text.
      { content: "Marking", x: columns[0], y: 87, bold: 500, color: '#fff' },
      { content: "Qty", x: columns[1], y: 87, bold: 500, color: '#fff' },
      { content: "m³/kg", x: columns[2], y: 87, bold: 500, color: '#fff' },
      { content: "Harga", x: columns[3], y: 87, bold: 500, color: '#fff' },
      { content: "Vol. Charge", x: columns[4], y: 87, bold: 500, color: '#fff' },
      { content: "Biaya Tambahan", x: columns[5], y: 87, bold: 500, color: '#fff' },
      { content: "Ongkos Kirim", x: columns[6], y: 87, bold: 500, color: '#fff' },
      { content: "Diskon", x: columns[7], y: 87, bold: 500, color: '#fff' },
      { content: "Biaya Lain-Lain", x: columns[8], y: 87, bold: 500, color: '#fff' },
      { content: "Total", x: columns[9], y: 87, bold: 500, color: '#fff' },
      { content: "Keterangan", x: columns[10], y: 87, bold: 500, color: '#fff' },

      // Table content.
      ...data.invoices
        .map((invoice: any, i: number) => {
          const y = 140 + (20 * i);
          return [
            { content: invoice.marking, x: columns[0], y },
            { content: invoice.quantity, x: columns[1], y },
            { content: commaSeparate(invoice.measurement), x: columns[2], y },
            { content: commaSeparate(invoice.price * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[3], y },
            { content: commaSeparate(invoice.volume_charge * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[4], y },
            { content: commaSeparate(invoice.additional_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[5], y },
            { content: commaSeparate(invoice.shipment_fee * invoice.exchange_rate), prefix: DEFAULT_SYMBOL, x: columns[6], y },
            { content: commaSeparate(invoice.discount), prefix: DEFAULT_SYMBOL, x: columns[7], y },
            { content: commaSeparate(invoice.other_fee), prefix: DEFAULT_SYMBOL, x: columns[8], y },
            { content: commaSeparate(invoice.total), prefix: DEFAULT_SYMBOL, x: columns[9], y },
            { content: invoice.description, x: columns[10], y }
          ];
        })
        .flat(),
      
      // Total Measurement, Margin, and Sub Total.
      { x: 245, y: offsetY, width: 625, height: 1 },
      { content: commaSeparate(totalMeasurement), x: 160, y: offsetY + 6 },
      { content: "Margin", x: 245, y: offsetY + 6, italic: true, color: '#f00' },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 300, y: offsetY + 6 },
      { content: "Sub Total", x: 645, y: offsetY + 6, italic: true, color: '#f00' },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 720, y: offsetY + 6 },

      // Margin and Grand Total.
      { x: 20, y: offsetY + 22, width: 850, height: 1 },
      { content: "Margin", x: 245, y: offsetY + 28, italic: true, bold: 700, color: '#f00' },
      { content: commaSeparate(total - data.total_fee), prefix: DEFAULT_SYMBOL, x: 300, y: offsetY + 28, bold: 700 },
      { content: "Grand Total", x: 645, y: offsetY + 28, italic: true, bold: 700, color: '#f00' },
      { content: commaSeparate(total), prefix: DEFAULT_SYMBOL, x: 720, y: offsetY + 28, bold: 700 }
    ];
  }
};

const titles: Titles = {
  "sf-surat-jalan-daerah": "Surat Jalan Daerah Sea Freight",
  "sf-surat-jalan": "Surat Jalan Sea Freight",
  "sf-faktur": "Faktur Sea Freight",
  "sf-rugi-laba": "Laporan Rugi Laba Sea Freight",
  "ac-surat-jalan-daerah": "Surat Jalan Daerah Air Cargo",
  "ac-surat-jalan": "Surat Jalan Daerah Air Cargo",
  "ac-faktur": "Faktur Air Cargo",
  "ac-rugi-laba": "Laporan Rugi Laba Air Cargo"
};

export { titles };
export default layouts;
