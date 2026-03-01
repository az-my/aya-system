export type Driver = {
  id: string
  nama: string
  unit: string
  tipe: string
}

export type Trip = {
  id: string
  driver: Driver
  uraian_kegiatan: string
  tujuan: string
  kendaraan: string
  tanggal_awal: string
  tanggal_akhir: string
  jumlah_hari: number
  jumlah_hari_penginapan: number
  unit_kerja: string
  periode_bulan: number
  periode_tahun: number
}

export type SPPDConfig = {
  company_name: string
  company_city: string
  signatory_name: string
  signatory_title: string
  supervisor_name: string
  supervisor_title: string
  tempat_berangkat: string
}

export type TripWithCosts = Trip & {
  konsumsi: number
  restitusi: number
  total_dibayarkan: number
}
