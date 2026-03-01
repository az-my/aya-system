-- SPPD Tables Migration
-- Run this in the Supabase SQL Editor

-- 1. Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama        text NOT NULL,
  jabatan     text DEFAULT 'Driver',
  unit        text,
  tipe        text DEFAULT 'Driver',
  aktif       boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 2. Trips table
CREATE TABLE IF NOT EXISTS trips (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id               uuid REFERENCES drivers(id) ON DELETE CASCADE,
  uraian_kegiatan         text NOT NULL,
  tujuan                  text NOT NULL,
  kendaraan               text DEFAULT 'Kendaraan Dinas',
  tanggal_awal            date NOT NULL,
  tanggal_akhir           date NOT NULL,
  jumlah_hari             int NOT NULL,
  jumlah_hari_penginapan  int DEFAULT 0,
  unit_kerja              text,
  periode_bulan           int NOT NULL,
  periode_tahun           int NOT NULL,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- 3. SPPD Config table
CREATE TABLE IF NOT EXISTS sppd_config (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name      text DEFAULT 'PT. PALMA NAFINDO PRATAMA',
  company_city      text DEFAULT 'BANDA ACEH',
  signatory_name    text DEFAULT 'RIZKY NAHA',
  signatory_title   text DEFAULT 'Direktur',
  supervisor_name   text DEFAULT 'ACHMAD SETIAWAN',
  supervisor_title  text DEFAULT 'Pengawas Pekerjaan',
  tempat_berangkat  text DEFAULT 'BANDA ACEH',
  updated_at        timestamptz DEFAULT now()
);

-- Insert default config row
INSERT INTO sppd_config (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- 4. Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE sppd_config ENABLE ROW LEVEL SECURITY;

-- 5. Permissive policies for authenticated users
CREATE POLICY "Authenticated users can manage drivers"
  ON drivers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage trips"
  ON trips FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sppd_config"
  ON sppd_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon access for development (remove in production)
CREATE POLICY "Anon can read drivers" ON drivers FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can manage drivers" ON drivers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can read trips" ON trips FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can manage trips" ON trips FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can read config" ON sppd_config FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can manage config" ON sppd_config FOR ALL TO anon USING (true) WITH CHECK (true);

-- 6. Seed drivers
INSERT INTO drivers (nama, unit, tipe) VALUES
  ('Nasrullah',         'UPT Banda Aceh',  'Driver'),
  ('Syamaun',           'UPT Banda Aceh',  'Driver'),
  ('Sunaryo',           'UPT Banda Aceh',  'Driver'),
  ('Junaidi',           'UPT Banda Aceh',  'Driver'),
  ('Edi Darmawan',      'UPT Banda Aceh',  'Driver'),
  ('Akmalul Basyar',    'UPT Banda Aceh',  'Driver'),
  ('Faisal Anwar',      'ULTG Langsa',     'Driver'),
  ('Rizal Syahputra',   'ULTG Meulaboh',   'Driver'),
  ('Yani Mulia',        'ULTG Banda Aceh', 'Driver'),
  ('Vany Al Wahabi',    'ULTG Langsa',     'Driver'),
  ('Kurnia Rinaldi',    'ULTG Meulaboh',   'Driver Sewa'),
  ('Romi Safruddin',    'ULTG Meulaboh',   'Driver'),
  ('M. Ichsan',         'ULTG Banda Aceh', 'Driver'),
  ('Erdiansyah',        'UPT Banda Aceh',  'Driver'),
  ('Uwis Karni',        'UPT Banda Aceh',  'Driver Sewa'),
  ('Syahril',           'UPT Banda Aceh',  'Driver Sewa'),
  ('Nugraha Ramadhan',  'ULTG Langsa',     'Driver Sewa');
