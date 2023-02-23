import { Presets } from "./components/abstractions/usePrint";
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
    // TODO
  ],
  "sf-faktur": data => [
    // TODO
  ],
  "sf-rugi-laba": data => [
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
