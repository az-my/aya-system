import type { Trip, TripWithCosts } from './types'

const RATE_KONSUMSI = 150_000
const RATE_PENGINAPAN = 250_000

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const BULAN_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export function formatDateLong(isoDate: string): string {
  const d = new Date(isoDate)
  return `${d.getDate()} ${BULAN_NAMES[d.getMonth()]} ${d.getFullYear()}`
}

export function getMonthName(month: number): string {
  return BULAN_NAMES[month - 1] ?? ''
}

export function getPeriodeLabel(bulan: number, tahun: number): string {
  return `${getMonthName(bulan).toUpperCase()} ${tahun}`
}

export function calculateCosts(trip: Trip): TripWithCosts {
  const konsumsi = trip.jumlah_hari * RATE_KONSUMSI
  const restitusi = trip.jumlah_hari_penginapan * RATE_PENGINAPAN
  return {
    ...trip,
    konsumsi,
    restitusi,
    total_dibayarkan: konsumsi + restitusi,
  }
}

export function groupTripsByDriver(
  trips: TripWithCosts[]
): Map<string, TripWithCosts[]> {
  const map = new Map<string, TripWithCosts[]>()
  for (const trip of trips) {
    const key = trip.driver.id
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(trip)
  }
  return map
}
