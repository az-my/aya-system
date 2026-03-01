import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { TripWithCosts, SPPDConfig } from './types'
import {
  formatDate,
  formatDateLong,
  formatRupiah,
  getPeriodeLabel,
  groupTripsByDriver,
} from './utils'

const s = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'Helvetica',
    fontSize: 8,
  },
  headerWrap: {
    marginBottom: 12,
  },
  headerLine: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  headerSpacer: {
    marginBottom: 2,
  },
  table: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    alignItems: 'flex-start',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
  },
  subTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  cell: {
    padding: 3,
    borderRightWidth: 0.5,
    borderRightColor: '#CCCCCC',
    flexWrap: 'wrap',
  },
  cellLast: {
    padding: 3,
    flexWrap: 'wrap',
  },
  th: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'center',
  },
  thRight: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'right',
  },
  td: {
    fontSize: 7,
  },
  tdCenter: {
    fontSize: 7,
    textAlign: 'center',
  },
  tdRight: {
    fontSize: 7,
    textAlign: 'right',
  },
  tdBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  tdBoldRight: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'right',
  },
  colNo: { width: '3%' },
  colNama: { width: '8%' },
  colUnit: { width: '7%' },
  colPekerjaan: { width: '7%' },
  colTglAwal: { width: '7%' },
  colTglAkhir: { width: '7%' },
  colHari: { width: '5%' },
  colPenginapan: { width: '5%' },
  colKonsumsi: { width: '9%' },
  colRestitusi: { width: '9%' },
  colTotal: { width: '9%' },
  colUraian: { width: '24%' },
  invoiceSection: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  invoiceRow: {
    flexDirection: 'row',
    width: 280,
    marginBottom: 2,
    justifyContent: 'flex-end',
  },
  invoiceLabel: {
    width: 140,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  invoiceValue: {
    width: 140,
    fontSize: 8,
    textAlign: 'right',
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    width: 280,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#333',
    justifyContent: 'flex-end',
  },
  invoiceTotalLabel: {
    width: 140,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  invoiceTotalValue: {
    width: 140,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  signatureBlock: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureCol: {
    width: '45%',
    fontSize: 8,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    marginTop: 40,
    textDecoration: 'underline',
  },
})

interface RekapBayarDocProps {
  trips: TripWithCosts[]
  config: SPPDConfig
  bulan: number
  tahun: number
}

export function RekapBayarDoc({
  trips,
  config,
  bulan,
  tahun,
}: RekapBayarDocProps) {
  const today = formatDateLong(new Date().toISOString())
  const grouped = groupTripsByDriver(trips)

  let rowNo = 0
  let grandTotalHari = 0
  let grandTotalPenginapan = 0
  let grandTotalKonsumsi = 0
  let grandTotalRestitusi = 0
  let grandTotalDibayarkan = 0

  Array.from(grouped.entries()).forEach(([, driverTrips]) => {
    grandTotalHari += driverTrips.reduce((a, t) => a + t.jumlah_hari, 0)
    grandTotalPenginapan += driverTrips.reduce(
      (a, t) => a + t.jumlah_hari_penginapan,
      0
    )
    grandTotalKonsumsi += driverTrips.reduce((a, t) => a + t.konsumsi, 0)
    grandTotalRestitusi += driverTrips.reduce((a, t) => a + t.restitusi, 0)
    grandTotalDibayarkan += driverTrips.reduce(
      (a, t) => a + t.total_dibayarkan,
      0
    )
  })

  const feeAdm = grandTotalDibayarkan * 0.05
  const subJumlah = grandTotalDibayarkan + feeAdm
  const ppn = subJumlah * 0.11
  const totalTagihan = subJumlah + ppn

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page} wrap>
        <View style={s.headerWrap} fixed>
          <Text style={s.headerLine}>
            REKAPITULASI PEMBAYARAN PERJALANAN DINAS TENAGA ALIH DAYA
          </Text>
          <Text style={s.headerLine}>
            PEKERJAAN PENGELOLAAN KENDARAAN DAN PENGEMUDI DI LINGKUNGAN
          </Text>
          <Text style={s.headerLine}>
            PT PLN (Persero) UIP3B SUMATERA UPT BANDA ACEH
          </Text>
          <Text style={[s.headerLine, s.headerSpacer]}>
            PERIODE {getPeriodeLabel(bulan, tahun)}
          </Text>
        </View>

        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <View style={[s.cell, s.colNo, s.th]}>
              <Text style={s.th}>NO</Text>
            </View>
            <View style={[s.cell, s.colNama, s.th]}>
              <Text style={s.th}>Nama</Text>
            </View>
            <View style={[s.cell, s.colUnit, s.th]}>
              <Text style={s.th}>Unit</Text>
            </View>
            <View style={[s.cell, s.colPekerjaan, s.th]}>
              <Text style={s.th}>Pekerjaan</Text>
            </View>
            <View style={[s.cell, s.colTglAwal, s.th]}>
              <Text style={s.th}>Tgl Awal</Text>
            </View>
            <View style={[s.cell, s.colTglAkhir, s.th]}>
              <Text style={s.th}>Tgl Akhir</Text>
            </View>
            <View style={[s.cell, s.colHari, s.th]}>
              <Text style={s.th}>Jumlah Hari SPPD</Text>
            </View>
            <View style={[s.cell, s.colPenginapan, s.th]}>
              <Text style={s.th}>Jumlah Hari Penginapan</Text>
            </View>
            <View style={[s.cell, s.colKonsumsi, s.thRight]}>
              <Text style={s.thRight}>Lumpsum Uang Konsumsi</Text>
            </View>
            <View style={[s.cell, s.colRestitusi, s.thRight]}>
              <Text style={s.thRight}>Jumlah Restitusi{'\n'}Penginapan/Transportasi</Text>
            </View>
            <View style={[s.cell, s.colTotal, s.thRight]}>
              <Text style={s.thRight}>Jumlah Yang Dibayarkan</Text>
            </View>
            <View style={[s.cellLast, s.colUraian, s.th]}>
              <Text style={s.th}>Uraian Kegiatan</Text>
            </View>
          </View>

          {Array.from(grouped.entries()).map(([driverId, driverTrips]) => {
            const stHari = driverTrips.reduce((a, t) => a + t.jumlah_hari, 0)
            const stPenginapan = driverTrips.reduce(
              (a, t) => a + t.jumlah_hari_penginapan,
              0
            )
            const stKonsumsi = driverTrips.reduce(
              (a, t) => a + t.konsumsi,
              0
            )
            const stRestitusi = driverTrips.reduce(
              (a, t) => a + t.restitusi,
              0
            )
            const stDibayarkan = driverTrips.reduce(
              (a, t) => a + t.total_dibayarkan,
              0
            )

            return (
              <View key={driverId}>
                {driverTrips.map((trip, idx) => {
                  rowNo++
                  const isFirst = idx === 0
                  return (
                    <View key={trip.id} style={s.tableRow}>
                      <View style={[s.cell, s.colNo, s.tdCenter]}>
                        <Text style={s.tdCenter}>{rowNo}</Text>
                      </View>
                      <View style={[s.cell, s.colNama, s.td]}>
                        <Text style={s.td}>{isFirst ? trip.driver.nama : ''}</Text>
                      </View>
                      <View style={[s.cell, s.colUnit, s.td]}>
                        <Text style={s.td}>{isFirst ? trip.driver.unit : ''}</Text>
                      </View>
                      <View style={[s.cell, s.colPekerjaan, s.td]}>
                        <Text style={s.td}>{isFirst ? trip.driver.tipe : ''}</Text>
                      </View>
                      <View style={[s.cell, s.colTglAwal, s.tdCenter]}>
                        <Text style={s.tdCenter}>{formatDate(trip.tanggal_awal)}</Text>
                      </View>
                      <View style={[s.cell, s.colTglAkhir, s.tdCenter]}>
                        <Text style={s.tdCenter}>{formatDate(trip.tanggal_akhir)}</Text>
                      </View>
                      <View style={[s.cell, s.colHari, s.tdCenter]}>
                        <Text style={s.tdCenter}>{trip.jumlah_hari}</Text>
                      </View>
                      <View style={[s.cell, s.colPenginapan, s.tdCenter]}>
                        <Text style={s.tdCenter}>{trip.jumlah_hari_penginapan}</Text>
                      </View>
                      <View style={[s.cell, s.colKonsumsi, s.tdRight]}>
                        <Text style={s.tdRight}>{formatRupiah(trip.konsumsi)}</Text>
                      </View>
                      <View style={[s.cell, s.colRestitusi, s.tdRight]}>
                        <Text style={s.tdRight}>{formatRupiah(trip.restitusi)}</Text>
                      </View>
                      <View style={[s.cell, s.colTotal, s.tdRight]}>
                        <Text style={s.tdRight}>{formatRupiah(trip.total_dibayarkan)}</Text>
                      </View>
                      <View style={[s.cellLast, s.colUraian, s.td]}>
                        <Text style={s.td}>{trip.uraian_kegiatan}</Text>
                      </View>
                    </View>
                  )
                })}
                <View style={s.subTotalRow}>
                  <View style={[s.cell, s.colNo, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                  <View style={[s.cell, { width: '25%' }, s.tdBold]}>
                    <Text style={s.tdBold}>Sub Total</Text>
                  </View>
                  <View style={[s.cell, s.colTglAwal, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                  <View style={[s.cell, s.colTglAkhir, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                  <View style={[s.cell, s.colHari, s.tdBold, s.tdCenter]}>
                    <Text style={[s.tdBold, s.tdCenter]}>{stHari}</Text>
                  </View>
                  <View style={[s.cell, s.colPenginapan, s.tdBold, s.tdCenter]}>
                    <Text style={[s.tdBold, s.tdCenter]}>{stPenginapan}</Text>
                  </View>
                  <View style={[s.cell, s.colKonsumsi, s.tdBoldRight]}>
                    <Text style={s.tdBoldRight}>{formatRupiah(stKonsumsi)}</Text>
                  </View>
                  <View style={[s.cell, s.colRestitusi, s.tdBoldRight]}>
                    <Text style={s.tdBoldRight}>{formatRupiah(stRestitusi)}</Text>
                  </View>
                  <View style={[s.cell, s.colTotal, s.tdBoldRight]}>
                    <Text style={s.tdBoldRight}>{formatRupiah(stDibayarkan)}</Text>
                  </View>
                  <View style={[s.cellLast, s.colUraian, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View style={s.invoiceSection}>
          <View style={s.invoiceRow}>
            <Text style={s.invoiceLabel}>JUMLAH</Text>
            <Text style={s.invoiceValue}>
              {formatRupiah(grandTotalDibayarkan)}
            </Text>
          </View>
          <View style={s.invoiceRow}>
            <Text style={s.invoiceLabel}>FEE ADM 5%</Text>
            <Text style={s.invoiceValue}>{formatRupiah(feeAdm)}</Text>
          </View>
          <View style={s.invoiceRow}>
            <Text style={s.invoiceLabel}>SUB JUMLAH</Text>
            <Text style={s.invoiceValue}>{formatRupiah(subJumlah)}</Text>
          </View>
          <View style={s.invoiceRow}>
            <Text style={s.invoiceLabel}>PPN 11%</Text>
            <Text style={s.invoiceValue}>{formatRupiah(ppn)}</Text>
          </View>
          <View style={s.invoiceTotalRow}>
            <Text style={s.invoiceTotalLabel}>TOTAL TAGIHAN</Text>
            <Text style={s.invoiceTotalValue}>
              {formatRupiah(totalTagihan)}
            </Text>
          </View>
        </View>

        <View style={s.signatureBlock}>
          <View style={s.signatureCol}>
            <Text>Banda Aceh, {today}</Text>
            <Text style={{ marginTop: 8 }}>Dibuat Oleh,</Text>
            <Text>PT. PALMA NAFINDO PRATAMA</Text>
            <Text style={s.signatureName}>{config.signatory_name}</Text>
          </View>
          <View style={s.signatureCol}>
            <Text>{' '}</Text>
            <Text style={{ marginTop: 8 }}>Disetujui,</Text>
            <Text>Pengawas Pekerjaan</Text>
            <Text style={s.signatureName}>{config.supervisor_name}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
