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
    { content: data.measurement, suffix: data.unit, x: 60, y: 160 },
    { content: data.phone_number, prefix: "Telp:", x: 110, y: 60 },
    { content: data.home_number, prefix: "Hp:", x: 110, y: 75 },
    { content: data.route, prefix: "Sea Freight:", x: 160, y: 160 },
    { content: data.marking, prefix: "Marking:", x: 160, y: 175 },
    { content: data.container_number, prefix: "Nomor Container:", x: 160, y: 190 },
    { content: data.customer, x: 440, y: 65 },
    { content: data.address, x: 440, y: 80 },
    { content: data.city, x: 440, y: 95 }
  ],
  "sf-surat-jalan-daerah": data => [
    { content: data.measurement, suffix: data.unit, x: 60, y: 160 },
    { content: data.company_data.name, prefix: "Sip.", x: 110, y: 45 },
    { content: data.company_data.address, x: 110, y: 60 },
    { content: data.company_data.phone_number, x: 110, y: 75 },
    { content: data.route, prefix: "Sea Freight:", x: 160, y: 160 },
    { content: data.marking, prefix: "Marking:", x: 160, y: 175 },
    { content: data.container_number, prefix: "Nomor Container:", x: 160, y: 190 },
    { content: "Untuk dikirim ke:", x: 160, y: 210 },
    { content: data.customer, x: 160, y: 225 },
    { content: data.address, x: 160, y: 240 },
    { content: data.city, x: 160, y: 255 },
    { content: data.phone_number, prefix: "Telp:", x: 160, y: 270 },
    { content: data.home_number, prefix: "Hp:", x: 160, y: 285 },
    { content: data.phone_number, prefix: "Telp:", x: 440, y: 110 }
  ],
  "sf-faktur": data => [
    { content: "Invoice", x: 285, y: 40, size: 18, bold: 700, underline: true },
    { content: data._id, prefix: "No. Faktur:", x: 20, y: 20 },
    { content: data.via_transfer ? data.customer_data?.via_transfer : '', x: 440, y: 20 },
    { content: data.customer, x: 140, y: 100 },
    { content: "di", x: 140, y: 115 },
    { content: data.city, x: 140, y: 130 },
    { content: `${data.company_data.city}, ${dateToString(data.date)}`, x: 430, y: 100 },
    { content: data.carrier ?? '-', prefix: "Shipper:", x: 430, y: 115 },
    { content: data.measurement, suffix: data.measurement_option.substr(-3, 2), x: 65, y: 200 },
    { content: `${data.route} (${data.quantity} φ) ${data.product_detail}`, prefix: "Sea Freight", x: 145, y: 200 },
    { content: commaSeparate(data.price * data.exchange_rate), prefix: DEFAULT_SYMBOL, x: 430, y: 200 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 200 },
    { content: data.container_number, prefix: "Nomor Container:", x: 145, y: 225 },
    { content: data.marking, prefix: "Marking:", x: 145, y: 280 },
    { content: "TOTAL", x: 450, y: 280, bold: 600 },
    { content: commaSeparate(data.total), prefix: DEFAULT_SYMBOL, x: 530, y: 280 }
  ],
  "sf-rugi-laba": data => [
    { content: "Laporan Rugi Laba", x: 380, y: 20, size: 18, bold: 700, italic: true, color: '#004D52' },
    { content: "Handal Cargo", x: 400, y: 40, size: 18, bold: 700, color: '#004D52' },
    { x: 20, y: 80, width: 850, height: 25 },
    { x: 20, y: 82, width: 850, height: 1, color: '#fff' },
    { x: 20, y: 102, width: 850, height: 1, color: '#fff' },
    // TODO
  ],
  "ac-surat-jalan": data => [
    // TODO
  ],
  "ac-surat-jalan-daerah": data => [
    // TODO
  ],
  "ac-faktur": data => [
    // TODO
  ],
  "ac-rugi-laba": data => [
    // TODO
  ]
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
