import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { TripWithCosts, SPPDConfig } from './types'
import { formatDate, formatDateLong, getPeriodeLabel, groupTripsByDriver } from './utils'

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
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  grandTotalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    alignItems: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  cell: {
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: '#CCCCCC',
    flexWrap: 'wrap',
  },
  cellLast: {
    padding: 4,
    flexWrap: 'wrap',
  },
  th: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'center',
  },
  td: {
    fontSize: 7,
  },
  tdCenter: {
    fontSize: 7,
    textAlign: 'center',
  },
  tdBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  colNo: { width: '4%' },
  colNama: { width: '10%' },
  colUnit: { width: '9%' },
  colPekerjaan: { width: '8%' },
  colTglAwal: { width: '9%' },
  colTglAkhir: { width: '9%' },
  colHari: { width: '7%' },
  colPenginapan: { width: '7%' },
  colUraian: { width: '37%' },
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

interface RincianPenetapanDocProps {
  trips: TripWithCosts[]
  config: SPPDConfig
  bulan: number
  tahun: number
}

export function RincianPenetapanDoc({
  trips,
  config,
  bulan,
  tahun,
}: RincianPenetapanDocProps) {
  const today = formatDateLong(new Date().toISOString())
  const grouped = groupTripsByDriver(trips)

  let rowNo = 0
  let grandTotalHari = 0
  let grandTotalPenginapan = 0

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page} wrap>
        <View style={s.headerWrap} fixed>
          <Text style={s.headerLine}>
            RINCIAN PENETAPAN PERJALANAN DINAS TENAGA ALIH DAYA
          </Text>
          <Text style={s.headerLine}>
            PEKERJAAN PENGELOLAAN KENDARAAN DAN PENGEMUDI DI LINGKUNGAN
          </Text>
          <Text style={s.headerLine}>
            PT PLN (Persero) UIP3B SUMATERA UPT BANDA ACEH
          </Text>
          <Text style={[s.headerLine, s.headerSpacer]}>
            PADA UNIT PELAKSANA TRANSMISI BANDA ACEH PERIODE{' '}
            {getPeriodeLabel(bulan, tahun)}
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
              <Text style={s.th}>Tgl Awal SPPD</Text>
            </View>
            <View style={[s.cell, s.colTglAkhir, s.th]}>
              <Text style={s.th}>Tgl Akhir SPPD</Text>
            </View>
            <View style={[s.cell, s.colHari, s.th]}>
              <Text style={s.th}>Jml Hari SPPD</Text>
            </View>
            <View style={[s.cell, s.colPenginapan, s.th]}>
              <Text style={s.th}>Jml Hari Penginapan</Text>
            </View>
            <View style={[s.cellLast, s.colUraian, s.th]}>
              <Text style={s.th}>Uraian Kegiatan</Text>
            </View>
          </View>

          {Array.from(grouped.entries()).map(([driverId, driverTrips]) => {
            const subtotalHari = driverTrips.reduce(
              (sum, t) => sum + t.jumlah_hari,
              0
            )
            const subtotalPenginapan = driverTrips.reduce(
              (sum, t) => sum + t.jumlah_hari_penginapan,
              0
            )
            grandTotalHari += subtotalHari
            grandTotalPenginapan += subtotalPenginapan

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
                  <View style={[s.cell, { width: '27%' }, s.tdBold]}>
                    <Text style={s.tdBold}>Sub Total</Text>
                  </View>
                  <View style={[s.cell, s.colTglAwal, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                  <View style={[s.cell, s.colTglAkhir, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                  <View style={[s.cell, s.colHari, s.tdBold, s.tdCenter]}>
                    <Text style={[s.tdBold, s.tdCenter]}>{subtotalHari}</Text>
                  </View>
                  <View style={[s.cell, s.colPenginapan, s.tdBold, s.tdCenter]}>
                    <Text style={[s.tdBold, s.tdCenter]}>{subtotalPenginapan}</Text>
                  </View>
                  <View style={[s.cellLast, s.colUraian, s.tdBold]}>
                    <Text style={s.tdBold}></Text>
                  </View>
                </View>
              </View>
            )
          })}

          <View style={s.grandTotalRow}>
            <View style={[s.cell, s.colNo, s.tdBold]}>
              <Text style={s.tdBold}></Text>
            </View>
            <View style={[s.cell, { width: '27%' }, s.tdBold]}>
              <Text style={s.tdBold}>JUMLAH</Text>
            </View>
            <View style={[s.cell, s.colTglAwal, s.tdBold]}>
              <Text style={s.tdBold}></Text>
            </View>
            <View style={[s.cell, s.colTglAkhir, s.tdBold]}>
              <Text style={s.tdBold}></Text>
            </View>
            <View style={[s.cell, s.colHari, s.tdBold, s.tdCenter]}>
              <Text style={[s.tdBold, s.tdCenter]}>{grandTotalHari}</Text>
            </View>
            <View style={[s.cell, s.colPenginapan, s.tdBold, s.tdCenter]}>
              <Text style={[s.tdBold, s.tdCenter]}>{grandTotalPenginapan}</Text>
            </View>
            <View style={[s.cellLast, s.colUraian, s.tdBold]}>
              <Text style={s.tdBold}></Text>
            </View>
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
