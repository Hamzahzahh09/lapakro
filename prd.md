# 🎮 PRD — LapakRo
**Marketplace Produk Roblox Indonesia**
**Versi:** 1.0 | **Tanggal:** Juni 2025 | **Status:** Draft Internal

---

## Daftar Isi
1. [Pendahuluan & Latar Belakang](#1-pendahuluan--latar-belakang)
2. [Produk & Kategori yang Dijual](#2-produk--kategori-yang-dijual)
3. [Target Pengguna & Persona](#3-target-pengguna--persona)
4. [Fitur Produk (MVP v1.0)](#4-fitur-produk-mvp-v10)
5. [Verifikasi & Keamanan Seller](#5-verifikasi--keamanan-seller)
6. [Model Bisnis & Monetisasi](#6-model-bisnis--monetisasi)
7. [Arsitektur & Persyaratan Teknis](#7-arsitektur--persyaratan-teknis)
8. [Roadmap Pengembangan](#8-roadmap-pengembangan)
9. [KPI & Metrik Keberhasilan](#9-kpi--metrik-keberhasilan)
10. [Risiko & Mitigasi](#10-risiko--mitigasi)
11. [Catatan & Asumsi](#11-catatan--asumsi)

---

## 1. Pendahuluan & Latar Belakang

Roblox adalah platform game terbesar di dunia dengan lebih dari 380 juta akun terdaftar dan puluhan juta pengguna aktif harian. Di Indonesia, komunitas Roblox tumbuh pesat — terutama di kalangan anak-anak dan remaja. Namun, **belum ada marketplace khusus berbahasa Indonesia** yang aman, terpercaya, dan lengkap untuk transaksi produk-produk Roblox.

**LapakRo** hadir untuk mengisi celah ini: sebuah platform C2C (Consumer-to-Consumer) yang menghubungkan seller dan buyer produk Roblox secara aman dengan sistem escrow, verifikasi seller, dan dukungan pembayaran lokal Indonesia.

### 1.1 Masalah yang Diselesaikan

- Tidak ada platform terpusat khusus Roblox di Indonesia — transaksi tersebar di medsos, Discord, dan forum
- Risiko penipuan tinggi karena tidak ada sistem escrow
- Seller sulit menjangkau buyer yang relevan tanpa biaya promosi besar
- Buyer kesulitan menemukan produk Roblox terpercaya dengan harga kompetitif

### 1.2 Tujuan Produk

- Menyediakan marketplace terpercaya khusus produk digital Roblox
- Melindungi buyer dan seller melalui sistem escrow dan verifikasi KYC
- Mendukung ekosistem Roblox Indonesia dengan fitur komunitas dan reputasi
- Menghasilkan revenue melalui komisi transaksi yang transparan

### 1.3 Info Dokumen

| Atribut | Detail |
|---|---|
| Nama Produk | LapakRo |
| Tipe | Marketplace C2C (Consumer-to-Consumer) |
| Platform | Web Application (Responsive) |
| Target Pasar | Indonesia — Semua Umur |
| Model Bisnis | Komisi per transaksi dari seller |
| Target Launch | Q3 2025 |

---

## 2. Produk & Kategori yang Dijual

Platform mendukung enam kategori utama produk Roblox:

| Kategori | Deskripsi Produk | Catatan |
|---|---|---|
| **Robux** | Transfer Robux langsung ke akun buyer | Wajib verifikasi seller; rate mengikuti pasar |
| **Game Pass** | Pass untuk game spesifik Roblox | Seller harus memiliki game pass yang valid |
| **Item Avatar / UGC** | Pakaian, aksesori, dan item avatar Roblox | Bukti kepemilikan item wajib dilampirkan |
| **Account Roblox** | Jual beli akun Roblox | KYC ketat; escrow wajib; kategori usia 18+ |
| **Jasa Boosting** | Level up, coin farming, achievement unlock | SLA jelas; auto-refund jika tidak terpenuhi |
| **Jasa Joki** | Pengerjaan quest, event, atau ranked by request | Briefing detail wajib sebelum transaksi dimulai |

---

## 3. Target Pengguna & Persona

### 3.1 Segmen Pengguna

- **Buyer** — Pemain Roblox dari semua umur (dengan perlindungan khusus untuk pengguna di bawah 13 tahun)
- **Seller** — Individu atau reseller yang menjual produk/jasa Roblox
- **Admin / Moderator** — Tim internal yang mengelola platform dan menyelesaikan dispute

### 3.2 Persona Utama

#### Persona 1: Buyer — "Adit, 14 tahun, Pelajar SMP"
- Bermain Roblox setiap hari, ingin beli Robux murah dan aman
- Budget terbatas, sering pakai QRIS atau minta orang tua transfer bank
- Takut ditipu, butuh jaminan uang kembali jika produk tidak dikirim
- **Kebutuhan:** UI simpel, harga transparan, proses cepat, ada live chat

#### Persona 2: Seller — "Santi, 22 tahun, Reseller Robux"
- Sudah jual Robux 2 tahun via Instagram dan WhatsApp
- Ingin platform profesional untuk kelola pesanan dan reputasi
- Butuh dashboard untuk lacak transaksi, statistik, dan rating
- **Kebutuhan:** Onboarding mudah, komisi wajar, pencairan saldo cepat

#### Persona 3: Buyer Dewasa — "Rizky, 25 tahun, Kolektor Item Roblox"
- Sering beli item UGC langka dan account Roblox dengan statistik tinggi
- Mau bayar lebih untuk jaminan keamanan dan keaslian produk
- **Kebutuhan:** Verifikasi seller, escrow terpercaya, dan riwayat transaksi lengkap

---

## 4. Fitur Produk (MVP v1.0)

### 4.1 Modul Autentikasi & Profil

- Registrasi dengan email, Google OAuth, atau nomor HP
- Verifikasi email dan OTP untuk aktivasi akun
- Profil pengguna: foto, username, bio, rating, dan riwayat transaksi
- Penanda usia untuk akun di bawah 13 tahun (pembatasan kategori)
- Mode Buyer / Seller / Keduanya yang bisa diaktifkan dari profil

### 4.2 Listing Produk & Search/Filter

- Seller bisa membuat listing dengan: judul, deskripsi, harga, kategori, bukti produk
- Upload screenshot, video demo, atau bukti kepemilikan
- Search bar dengan autocomplete untuk cari produk spesifik
- Filter: kategori, harga min-max, rating seller, status stok, metode pengiriman
- Sort: terbaru, terlaris, harga terendah, rating tertinggi
- Halaman detail produk dengan galeri media, deskripsi lengkap, dan ulasan

### 4.3 Sistem Transaksi & Escrow

- **Alur:** Buyer pesan → Bayar ke escrow → Seller kirim → Buyer konfirmasi → Dana dilepas
- Timer otomatis: jika buyer tidak konfirmasi dalam 3×24 jam, dana auto-release ke seller
- Auto-refund ke wallet buyer jika seller tidak merespons dalam 24 jam
- Riwayat transaksi lengkap dengan status real-time
- Notifikasi email dan in-app di setiap perubahan status transaksi

### 4.4 Pembayaran (Payment Gateway)

- QRIS (GoPay, OVO, Dana, LinkAja, dan semua dompet digital kompatibel QRIS)
- Transfer Bank: BCA, Mandiri, BRI, BNI (via Virtual Account)
- Wallet internal untuk saldo escrow dan hasil penjualan
- Minimum deposit: Rp 5.000 | Minimum penarikan: Rp 20.000
- Biaya withdrawal: gratis untuk VA bank, Rp 2.500 untuk e-wallet

### 4.5 Review & Rating Seller

- Rating bintang 1–5 per transaksi yang selesai
- Ulasan teks (10–500 karakter)
- Foto bukti bisa dilampirkan di ulasan
- Seller bisa membalas ulasan
- Badge khusus: **Verified Seller**, **Top Seller**, **Fast Response**

### 4.6 Live Chat Buyer-Seller

- Chat real-time setelah transaksi dimulai
- Dukungan pengiriman gambar dan file (maks. 10 MB)
- Quick replies template untuk seller
- History chat tersimpan permanen untuk keperluan dispute
- Notifikasi push dan email untuk pesan baru

### 4.7 Sistem Dispute & Komplain

- Tombol "Buka Dispute" tersedia selama 3 hari setelah pengiriman diklaim
- Form dispute: pilih alasan, deskripsi masalah, upload bukti
- Admin merespons dalam maks. 1×24 jam kerja
- Resolusi: refund penuh, refund sebagian, atau transaksi dilanjutkan
- Eskalasi ke mediasi manual jika auto-resolve gagal

### 4.8 Wallet & Saldo Internal

- Wallet buyer: untuk menyimpan saldo deposit dan refund
- Wallet seller: menampung hasil penjualan setelah escrow dilepas
- Penarikan ke rekening bank atau e-wallet (proses 1–3 hari kerja)
- Riwayat mutasi saldo lengkap dengan filter tanggal

### 4.9 Dashboard Seller Analytics

- Total pendapatan (harian, mingguan, bulanan, kustom)
- Jumlah transaksi berhasil, pending, dan dibatalkan
- Produk terlaris dan yang kurang diminati
- Rating rata-rata dan tren kepuasan buyer
- Grafik performa listing: views, klik, dan konversi

---

## 5. Verifikasi & Keamanan Seller

Platform menggunakan tiga lapis perlindungan:

### 5.1 Admin Manual Review
- Setiap listing baru ditinjau admin sebelum tayang (maks. 6 jam kerja)
- Listing mencurigakan (harga terlalu murah, bukti palsu) ditolak dan seller diberi peringatan
- Seller dengan 3 peringatan → dinonaktifkan sementara; 5 peringatan → banned permanen

### 5.2 KYC (Know Your Customer) untuk Seller

| Level | Persyaratan | Akses |
|---|---|---|
| **Level 1** — Basic Seller | Email terverifikasi + HP OTP | Robux, Game Pass, Jasa |
| **Level 2** — Verified Seller | KTP/SIM + selfie | Item Avatar, Jasa Joki/Boosting |
| **Level 3** — Premium Seller | KTP + rekening bank + NPWP | Account Roblox |

Data KYC dienkripsi AES-256, tidak dibagikan ke pihak ketiga.

### 5.3 Sistem Reputasi Otomatis
- Skor reputasi dihitung dari: rating buyer, kecepatan respons, tingkat dispute, dan volume transaksi
- Badge otomatis: New Seller → Rising Seller → Trusted Seller → Top Seller
- Seller dengan skor < 2.5 bintang setelah 10+ transaksi otomatis dinonaktifkan listing-nya
- Fraud detection: deteksi pola transaksi mencurigakan

---

## 6. Model Bisnis & Monetisasi

### 6.1 Komisi Transaksi

| Kategori Produk | Komisi Platform | Seller Terima | Keterangan |
|---|---|---|---|
| Robux | 5% | 95% | Standar pasar |
| Game Pass | 7% | 93% | Termasuk fee gateway |
| Item Avatar / UGC | 8% | 92% | Termasuk fee gateway |
| Account Roblox | 10% | 90% | Risiko lebih tinggi |
| Jasa Boosting / Joki | 10% | 90% | Per pesanan selesai |

> Komisi dipotong otomatis dari escrow saat dana dilepas ke seller. Buyer tidak dikenakan biaya tambahan.

### 6.2 Revenue Tambahan (Fase Berikutnya)
- **Listing Featured:** Seller bayar Rp 10.000–50.000 untuk tampil di bagian teratas pencarian
- **Seller Pro Plan:** Langganan Rp 99.000/bulan untuk analytics lanjutan dan badge premium
- **Iklan in-platform** (hanya di halaman utama, tidak di halaman produk)

---

## 7. Arsitektur & Persyaratan Teknis

### 7.1 Tech Stack (Rekomendasi)

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | SSR untuk SEO, PWA-ready |
| Backend | Node.js + NestJS | REST API + WebSocket untuk chat |
| Database | PostgreSQL + Redis | PostgreSQL utama, Redis untuk session & cache |
| File Storage | AWS S3 / Cloudflare R2 | Upload bukti produk dan media |
| Payment | Midtrans / Xendit | QRIS, VA bank, dompet digital Indonesia |
| Real-time Chat | Socket.io | Live chat buyer-seller |
| KYC | Verihubs / Privy | Verifikasi KTP dan selfie otomatis |
| Hosting | Vercel (FE) + Railway (BE) | Scalable, biaya terjangkau untuk MVP |

### 7.2 Non-Functional Requirements

- **Performance:** Halaman utama load < 2 detik; API response < 500ms
- **Availability:** Uptime 99.5% (maks. downtime 3.65 jam/bulan)
- **Security:** HTTPS wajib, enkripsi AES-256, proteksi XSS & CSRF
- **Scalability:** Arsitektur siap horizontal scaling saat user > 10.000
- **Mobile-first:** Responsive untuk layar 360px ke atas
- **Aksesibilitas:** Kontras warna WCAG AA; label form lengkap

---

## 8. Roadmap Pengembangan

| Fase | Timeline | Deliverable |
|---|---|---|
| **Fase 0:** Discovery | Bulan 1 | Finalisasi PRD, wireframe, desain sistem, setup repository |
| **Fase 1:** MVP | Bulan 2–4 | Auth, listing, search, escrow, wallet, payment, chat, rating |
| **Fase 2:** Trust | Bulan 5–6 | KYC seller, dispute system, dashboard analytics, notifikasi email |
| **Fase 3:** Growth | Bulan 7–9 | Featured listing, seller pro plan, program afiliasi, SEO |
| **Fase 4:** Scale | Bulan 10–12 | Mobile app (Android/iOS), API publik untuk seller tools |

---

## 9. KPI & Metrik Keberhasilan

Target 6 bulan pertama setelah launch:

| Metrik | Target | Cara Ukur |
|---|---|---|
| Registered Users | 5.000 user | Database count |
| Active Sellers (terverifikasi) | 500 seller | Seller dengan min. 1 listing aktif |
| Monthly Transactions | 2.000 transaksi/bulan | Escrow completed per bulan |
| Gross Merchandise Value (GMV) | Rp 100 juta/bulan | Total nilai transaksi selesai |
| Dispute Rate | < 3% | (Dispute / Total transaksi) × 100% |
| Seller Satisfaction Score | > 4.2 / 5 | Rating rata-rata platform dari seller |

---

## 10. Risiko & Mitigasi

| Risiko | Tingkat | Mitigasi |
|---|---|---|
| Penipuan oleh seller (akun/produk palsu) | 🔴 Tinggi | KYC berlapis, escrow wajib, admin review listing |
| Pelanggaran ToS Roblox (jual akun) | 🔴 Tinggi | Legal disclaimer, batasan usia 18+, edukasi user |
| Chargeback dari metode pembayaran | 🟡 Sedang | Dana escrow di-hold, kebijakan refund ketat |
| Pertumbuhan lambat (cold start problem) | 🟡 Sedang | Insentif seller awal, kolaborasi komunitas Discord/Reddit Roblox |
| Persaingan dari grup Facebook/WhatsApp | 🟢 Rendah | Value prop: escrow + reputasi seller yang tidak ada di medsos |

---

## 11. Catatan & Asumsi

- Platform tidak berafiliasi secara resmi dengan Roblox Corporation.
- Transaksi Robux mengikuti aturan Roblox — seller bertanggung jawab atas metode pengiriman yang sah.
- Fitur di atas mencakup MVP v1.0; fitur lanjutan akan didefinisikan di PRD v2.0 setelah evaluasi data pengguna.
- Semua estimasi timeline bersifat indikatif dan dapat berubah berdasarkan kapasitas tim pengembang.
- Kebijakan privasi dan syarat & ketentuan lengkap akan disusun oleh tim hukum sebelum launch.

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal tim LapakRo.*
*Dibuat: Juni 2025 · Versi: 1.0 · Penulis: Tim Produk*