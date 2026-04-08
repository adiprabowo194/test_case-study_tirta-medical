# TEST CASE STUDY - INTERVIEW TEST

Test Case ini adalah iimplementasi sistem manajemen produk berbasis arsitektur **CQRS** (_Command Query Responsibility Segregation_). Sistem ini memisahkan operasi penulisan data (Command) dan pembacaan data (Query) ke dalam dua layanan terpisah dengan database masing-masing untuk menjaga performa dan skalabilitas.

## 🚀 Arsitektur Sistem

1. **Command-API**: Menangani operasi _Write_ (Create, Update, Delete) menggunakan database `db_command`.
2. **Query-API**: Menangani operasi _Read_ (Search/Filter) menggunakan database `db_query`.
3. **RabbitMQ**: Bertindak sebagai jembatan komunikasi antar servis. Setiap perubahan data di Command-API akan dikirim ke RabbitMQ dan dikonsumsi oleh Query-API untuk sinkronisasi database.

---

## 🛠️ Persiapan Lingkungan (Setup)

### 1. Prasyarat

- **Node.js**: v16+
- **MySQL**: Pastikan Anda memiliki dua database terpisah (`db_command` dan `db_query`).
- **RabbitMQ**: Pastikan server RabbitMQ sudah berjalan di lokal atau server Anda.

### 2. Instalasi Dependensi

Jalankan perintah ini di setiap folder:

```bash
# Di folder command-api
cd command-api && npm install

# Di folder query-api
cd ../query-api && npm install
```

## 3. Unit Testing with Jest

Pengujian otomatis dilakukan menggunakan **Jest** sebagai _test runner_ dan **Supertest** untuk simulasi HTTP request. Karena project ini menggunakan **ES Modules** di lingkungan Windows, pengujian dijalankan langsung melalui Node.js untuk memastikan kompatibilitas penuh.

### Menjalankan Test secara Manual:

Anda dapat menjalankan perintah berikut di terminal:

- **Command-API (Write Service):**

```bash
cd command-api
node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand
```
