import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { TripWithCosts, SPPDConfig } from './types'
import { formatRupiah, formatDateLong } from './utils'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    padding: 2,
    flexWrap: 'wrap',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
  blankRow: {
    height: 6,
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
})

interface SPPDIndividualDocProps {
  trips: TripWithCosts[]
  config: SPPDConfig
}

export function SPPDIndividualDoc({ trips, config }: SPPDIndividualDocProps) {
  return (
    <Document>
      {trips.map((trip) => (
        <Page key={trip.id} size="A4" style={styles.page}>
          {/* HEADER ROW */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '100%' }]}>
              <Text style={styles.headerTitle}>
                SURAT PERINTAH PERJALANAN DINAS (SPPD)
              </Text>
            </View>
          </View>

          {/* SECTION 1 Row 1 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>1.</Text>
            </View>
            <View style={[styles.cell, { width: '24%' }]}>
              <Text>Pegawai yang di Perintah</Text>
            </View>
            <View style={[styles.cell, { width: '22%' }]}>
              <Text>Nama    :</Text>
            </View>
            <View style={[styles.cell, { width: '50%' }]}>
              <Text>{trip.driver.nama}</Text>
            </View>
          </View>
          {/* SECTION 1 Row 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '24%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '22%' }]}>
              <Text>Jabatan :</Text>
            </View>
            <View style={[styles.cell, { width: '50%' }]}>
              <Text>{trip.driver.tipe}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>2.</Text>
            </View>
            <View style={[styles.cell, { width: '24%' }]}>
              <Text>Maksud Perjalanan Dinas</Text>
            </View>
            <View style={[styles.cell, { width: '72%' }]}>
              <Text>{trip.uraian_kegiatan}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 3 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>3.</Text>
            </View>
            <View style={[styles.cell, { width: '24%' }]}>
              <Text>Alat angkutan yang dipergunakan</Text>
            </View>
            <View style={[styles.cell, { width: '72%' }]}>
              <Text>{trip.kendaraan}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 4 Row 1 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>4.</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>a.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Tempat berangkat (tempat kedudukan)</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>a.</Text>
            </View>
            <View style={[styles.cell, { width: '68%' }]}>
              <Text>{config.tempat_berangkat}</Text>
            </View>
          </View>
          {/* SECTION 4 Row 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>b.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Tempat Tujuan</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>b.</Text>
            </View>
            <View style={[styles.cell, { width: '68%' }]}>
              <Text>{trip.tujuan}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 5 Row 1 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>5.</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>a.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Lama perjalanan dinas</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>a.</Text>
            </View>
            <View style={[styles.cell, { width: '68%' }]}>
              <Text>{trip.jumlah_hari} hari</Text>
            </View>
          </View>
          {/* SECTION 5 Row 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>b.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Tanggal berangkat</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>b.</Text>
            </View>
            <View style={[styles.cell, { width: '68%' }]}>
              <Text>{formatDateLong(trip.tanggal_awal)}</Text>
            </View>
          </View>
          {/* SECTION 5 Row 3 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>c.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Tanggal kembali</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>c.</Text>
            </View>
            <View style={[styles.cell, { width: '68%' }]}>
              <Text>{formatDateLong(trip.tanggal_akhir)}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 6 Row 1 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>6.</Text>
            </View>
            <View style={[styles.cell, { width: '96%' }]}>
              <Text>Biaya</Text>
            </View>
          </View>
          {/* SECTION 6 Row 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>a.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Jumlah</Text>
            </View>
            <View style={[styles.cell, { width: '56%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, styles.right, { width: '16%' }]}>
              <Text>{formatRupiah(trip.total_dibayarkan)}</Text>
            </View>
          </View>
          {/* SECTION 6 Row 3 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>b.</Text>
            </View>
            <View style={[styles.cell, { width: '20%' }]}>
              <Text>Penanggung</Text>
            </View>
            <View style={[styles.cell, { width: '72%' }]}>
              <Text>{config.company_name}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.blankRow]} />

          {/* SECTION 7 HEADER */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>7.</Text>
            </View>
            <View style={[styles.cell, { width: '96%' }]}>
              <Text>Rincian biaya</Text>
            </View>
          </View>

          {/* SECTION 7.1 HEADER */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '92%' }]}>
              <Text style={styles.bold}>1. BIAYA ANGKUTAN</Text>
            </View>
          </View>

          {/* SECTION 7.1 DATA ROWS */}
          {[
            { i: '1' },
            { i: '1' },
            { i: '1' },
            { i: '0' },
          ].map((_, idx) => (
            <View key={idx} style={styles.row}>
              <View style={[styles.cell, { width: '47%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, { width: '5%' }]}>
                <Text>Rp</Text>
              </View>
              <View style={[styles.cell, { width: '7%' }]}>
                <Text>-</Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text>x</Text>
              </View>
              <View style={[styles.cell, { width: '7%' }]}>
                <Text>{idx < 3 ? '1' : '0'}</Text>
              </View>
              <View style={[styles.cell, { width: '6%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, styles.right, { width: '16%' }]}>
                <Text>-</Text>
              </View>
            </View>
          ))}

          {/* Row E - Airport Tax */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '47%' }]}>
              <Text>Airport Tax</Text>
            </View>
            <View style={[styles.cell, { width: '5%' }]}>
              <Text>Rp</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>+</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>Rp</Text>
            </View>
            <View style={[styles.cell, { width: '6%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, styles.right, { width: '16%' }]}>
              <Text>-</Text>
            </View>
          </View>
          {/* Row F & G - Biaya Angkutan dari Rumah (PP) */}
          {[1, 2].map((n) => (
            <View key={n} style={styles.row}>
              <View style={[styles.cell, { width: '47%' }]}>
                <Text>Biaya Angkutan dari Rumah (PP)</Text>
              </View>
              <View style={[styles.cell, { width: '5%' }]}>
                <Text>Rp</Text>
              </View>
              <View style={[styles.cell, { width: '7%' }]}>
                <Text>-</Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text>x</Text>
              </View>
              <View style={[styles.cell, { width: '7%' }]}>
                <Text>1</Text>
              </View>
              <View style={[styles.cell, { width: '6%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, { width: '4%' }]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, styles.right, { width: '16%' }]}>
                <Text>-</Text>
              </View>
            </View>
          ))}

          {/* SECTION 7.2 HEADER */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '92%' }]}>
              <Text style={styles.bold}>2. UANG HARIAN</Text>
            </View>
          </View>

          {/* Row H - Biaya Harian */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '32%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '15%' }]}>
              <Text>Biaya Harian</Text>
            </View>
            <View style={[styles.cell, { width: '5%' }]}>
              <Text>Rp</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>150.000</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>x</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>{trip.jumlah_hari}</Text>
            </View>
            <View style={[styles.cell, { width: '6%' }]}>
              <Text>Hari</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>x</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>100%</Text>
            </View>
            <View style={[styles.cell, styles.right, { width: '16%' }]}>
              <Text>{formatRupiah(trip.konsumsi)}</Text>
            </View>
          </View>

          {/* Row I - Biaya Penginapan */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '32%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '15%' }]}>
              <Text>Biaya Penginapan</Text>
            </View>
            <View style={[styles.cell, { width: '5%' }]}>
              <Text>Rp</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>250.000</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>x</Text>
            </View>
            <View style={[styles.cell, { width: '7%' }]}>
              <Text>{trip.jumlah_hari_penginapan}</Text>
            </View>
            <View style={[styles.cell, { width: '6%' }]}>
              <Text>Hari</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>x</Text>
            </View>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text>100%</Text>
            </View>
            <View style={[styles.cell, styles.right, { width: '16%' }]}>
              <Text>
                {trip.jumlah_hari_penginapan > 0
                  ? formatRupiah(trip.restitusi)
                  : '-'}
              </Text>
            </View>
          </View>

          {/* TOTAL ROW */}
          <View style={[styles.row, styles.totalRow]}>
            <View style={[styles.cell, styles.right, styles.bold, { width: '84%' }]}>
              <Text>TOTAL</Text>
            </View>
            <View style={[styles.cell, styles.right, styles.bold, { width: '16%' }]}>
              <Text>{formatRupiah(trip.total_dibayarkan)}</Text>
            </View>
          </View>

          <View style={[styles.row, { height: 8 }]} />

          {/* SECTION 8 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '4%' }]}>
              <Text style={styles.bold}>8.</Text>
            </View>
            <View style={[styles.cell, { width: '24%' }]}>
              <Text>Keterangan lain - lain</Text>
            </View>
            <View style={[styles.cell, { width: '72%' }]}>
              <Text></Text>
            </View>
          </View>

          {[1, 2, 3].map((n) => (
            <View key={n} style={[styles.row, styles.blankRow]} />
          ))}

          <View style={[styles.row, { height: 20 }]} />

          {/* FOOTER Row 1 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '54%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '46%' }]}>
              <Text>Dikeluarkan di   :   Banda Aceh</Text>
            </View>
          </View>
          {/* FOOTER Row 2 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '54%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, { width: '46%' }]}>
              <Text>Pada Tanggal     :   {formatDateLong(trip.tanggal_awal)}</Text>
            </View>
          </View>

          <View style={[styles.row, { height: 40 }]} />

          {/* DIREKTUR */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '54%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, styles.center, { width: '46%' }]}>
              <Text style={styles.bold}>DIREKTUR</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cell, { width: '54%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.cell, styles.center, { width: '46%' }]}>
              <Text>{config.signatory_name}</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}
