import { BSON } from 'realm-web';

export interface Staff {
  username: string
  password: string
  name: string
  access_level: BSON.ObjectId
  staff_group: BSON.ObjectId
  gender: boolean         // 0: Male | 1: Female
  address: string
  ward: string            // Kelurahan
  city: string
  home_number: string     // Nomor Telepon
  phone_number: string    // Nomor HP
  birthplace: string
  birthday: Date
  salary: number          // Gaji
  overtime_pay: number    // Lembur per Jam
  allowance: number       // Uang Makan
  holiday_pay: number     // THR
  bonus: number           // Uang Kerajinan
  status: boolean         // Active or Not Active
  employment_date: Date   // Tanggal Mulai Kerja
}

export interface SeaFreight {
  id: string              // Container ID
  item_code: string       // FIXME: This might not be supposed to be here.
  loading_date: Date      // Tanggal Muat
  arrival_date: Date      // Tanggal Tiba
  lading_date: Date       // Tanggal BL (Bill of Lading)
  container_group: BSON.ObjectId
  shipper: BSON.ObjectId
  route: BSON.ObjectId
  handler: BSON.ObjectId
  currency: BSON.ObjectId
  exchange_rate: number   // FIXME: This might not be supposed to be here.
  clearance_fee: number   // Biaya Custom Clearance
  loading_price: number   // Biaya Muat
  extra_fee: number       // Biaya Tambahan
  other_fee: number       // Biaya Lain-lain
  description: string     // Keterangan
}

export interface AirCargo {
  id: string
  item_code: string       // FIXME: This might not be supposed to be here.
  // TODO: the rest...
}

export interface Customer {
  id: string              // Customer ID
  name: string
  company_name: string
  address: string
  city: string
  zip_code: number
  address2: string
  city2: string
  zip_code2: number
  office_number: string   // Nomor Kantor
  office_number2: string
  phone_number: string    // Nomor HP
  phone_number2: string
  home_number: string     // Nomor Telepon
  fax: string
  email: string
  contact_person: string
  contact_person2: string
  sizing_details: string          // Keterangan Ukuran
  sending_details: BSON.ObjectId  // Keterangan Kirim
  description: string             // Lain-lain
  markings: Array<{
    code: string            // Kode Marking
    items: Array<{
      name: string          // Keterangan Barang
      channel: boolean      // 0: By Air | 1: By Sea
      route: BSON.ObjectId
      price: number
    }>
  }>
}

export interface CompanySingleton {
  name: string
  address: string
  city: string
  zip_code: number
  phone_number: string
  fax: string
  email: string
}

// TODO:
// Maybe instead of storing shortcuts globally for all clients,
// Each client should just have their own individual private shortcuts.
export interface ShortcutSingleton {
  key: string
  value: string
}
