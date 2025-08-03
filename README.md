# POS System - Aplikasi Point of Sale

Aplikasi POS (Point of Sale) modern yang dibangun dengan React, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

### 1. Manajemen Produk
- ✅ Tambah, edit, hapus produk
- ✅ Kategori produk (Makanan, Minuman, Snack, Elektronik, Pakaian, Lainnya)
- ✅ Upload gambar produk
- ✅ Barcode support
- ✅ Manajemen stok

### 2. Transaksi Penjualan
- ✅ Keranjang belanja dengan kalkulasi otomatis
- ✅ Diskon per item
- ✅ Pajak otomatis (11%)
- ✅ Multiple payment methods (Tunai, Kartu, E-Wallet)
- ✅ Cetak struk
- ✅ Kalkulasi kembalian

### 3. Dashboard & Analitik
- ✅ Statistik penjualan harian
- ✅ Peringatan stok menipis
- ✅ Transaksi terbaru
- ✅ Visualisasi data

### 4. Manajemen Pengguna
- ✅ Role-based access (Admin/Cashier)
- ✅ Login/logout system
- ✅ Demo accounts

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Heroicons
- **Backend**: Firebase (Firestore, Auth, Storage)
- **AI Integration**: Gemini AI (untuk analisis data)

## 📦 Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd pos-app
```

2. Install dependencies:
```bash
npm install
```

3. Setup Firebase (opsional):
   - Buat project Firebase baru
   - Enable Firestore, Authentication, dan Storage
   - Update konfigurasi di `src/config/firebase.ts`

4. Jalankan aplikasi:
```bash
npm run dev
```

## 🔐 Demo Accounts

### Admin Account
- **Email**: admin@pos.com
- **Password**: admin123
- **Fitur**: Akses penuh ke semua fitur

### Cashier Account
- **Email**: cashier@pos.com
- **Password**: cashier123
- **Fitur**: Hanya transaksi dan dashboard

## 🔧 API Configuration

### Firebase Configuration
Firebase sudah dikonfigurasi dengan project ID: `pos-4-90fb5`

**Services yang aktif:**
- ✅ Authentication
- ✅ Firestore Database
- ✅ Storage
- ✅ Analytics

### Gemini AI Configuration
Gemini AI sudah dikonfigurasi dan siap digunakan untuk:
- ✅ Analisis data penjualan
- ✅ Rekomendasi kategori produk
- ✅ Analisis kebiasaan pelanggan
- ✅ Prediksi penjualan
- ✅ Optimasi stok

## 📱 Cara Penggunaan

### 1. Login
- Buka aplikasi di browser
- Login dengan salah satu demo account
- Pilih role sesuai kebutuhan

### 2. Transaksi (Kasir)
1. Klik menu "Transaksi"
2. Pilih produk dari grid atau cari dengan search
3. Atur quantity dan diskon di keranjang
4. Pilih metode pembayaran
5. Klik "Cetak Struk & Selesai"

### 3. Manajemen Produk (Admin)
1. Klik menu "Produk"
2. Tambah produk baru dengan klik "Tambah Produk"
3. Edit produk dengan klik tombol "Edit"
4. Hapus produk dengan klik tombol "Hapus"

### 4. Dashboard
- Lihat statistik penjualan
- Monitor stok produk
- Lihat transaksi terbaru

## 🏗️ Struktur Project

```
src/
├── components/          # Komponen UI
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── pages/              # Halaman aplikasi
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Transaction.tsx
│   └── Products.tsx
├── store/              # State management
│   └── useStore.ts
├── config/             # Konfigurasi
│   └── firebase.ts
└── App.tsx            # Root component
```

## 🔧 Konfigurasi Firebase

Untuk menggunakan Firebase, update file `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📈 Roadmap

### Fitur yang Akan Ditambahkan
- [ ] Integrasi Gemini AI untuk analisis data
- [ ] Scan barcode dengan kamera
- [ ] Notifikasi stok habis
- [ ] Export laporan ke PDF/Excel
- [ ] Multi-device sync
- [ ] Backup data otomatis
- [ ] Integrasi printer thermal
- [ ] Mobile app (React Native)

### Integrasi AI
- [ ] Rekomendasi kategori produk
- [ ] Prediksi penjualan
- [ ] Analisis kebiasaan pelanggan
- [ ] Optimasi stok

## 🤝 Kontribusi

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan React + TypeScript + Tailwind CSS**
