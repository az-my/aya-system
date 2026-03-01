import { pdf } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { Trip, SPPDConfig } from './types'
import { calculateCosts, getMonthName } from './utils'
import { SPPDIndividualDoc } from './sppd-individual'
import { RincianPenetapanDoc } from './rincian-penetapan'
import { RekapBayarDoc } from './rekap-bayar'

// @react-pdf/renderer has strict element types — safe to cast our Document wrappers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPdf(element: ReactElement<any>) {
  return pdf(element).toBlob()
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function generateSPPDIndividual(
  trip: Trip,
  config: SPPDConfig
): Promise<void> {
  const tripWithCosts = calculateCosts(trip)
  const doc = createElement(SPPDIndividualDoc, {
    trips: [tripWithCosts],
    config,
  })
  const blob = await renderPdf(doc)
  const driverName = trip.driver.nama.replace(/\s+/g, '_')
  const filename = `SPPD_${driverName}_${trip.tanggal_awal}_${trip.tanggal_akhir}.pdf`
  triggerDownload(blob, filename)
}

export async function generateRincianPenetapan(
  trips: Trip[],
  config: SPPDConfig,
  bulan: number,
  tahun: number
): Promise<void> {
  const tripsWithCosts = trips.map(calculateCosts)
  const doc = createElement(RincianPenetapanDoc, {
    trips: tripsWithCosts,
    config,
    bulan,
    tahun,
  })
  const blob = await renderPdf(doc)
  const filename = `Rincian_Penetapan_SPPD_${getMonthName(bulan)}_${tahun}.pdf`
  triggerDownload(blob, filename)
}

export async function generateRekapBayar(
  trips: Trip[],
  config: SPPDConfig,
  bulan: number,
  tahun: number
): Promise<void> {
  const tripsWithCosts = trips.map(calculateCosts)
  const doc = createElement(RekapBayarDoc, {
    trips: tripsWithCosts,
    config,
    bulan,
    tahun,
  })
  const blob = await renderPdf(doc)
  const filename = `Rekap_Bayar_SPPD_${getMonthName(bulan)}_${tahun}.pdf`
  triggerDownload(blob, filename)
}
