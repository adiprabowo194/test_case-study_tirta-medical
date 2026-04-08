import request from 'supertest';
import app from '../src/app.js';
import 'dotenv/config';
import { sequelize } from '../src/models/index.js'; // Pastikan path ke models benar

describe('Command-API: Product Registration', () => {
    const apiKey = process.env.MY_API_KEY;

    // Menutup koneksi database setelah semua test selesai agar Jest berhenti dengan bersih
    afterAll(async () => {
        await sequelize.close();
    });

    // Skenario 1: Berhasil Register Produk (SUDAH PASS)
    it('should register a new product with 201 status', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `API-KEY ${apiKey}`)
            .send({
                sku: "UNIT-TEST-" + Date.now(),
                name: "Product Test",
                price: 15000,
                stock: 50,
                categoryId: "931ead14-de03-489f-8cb7-3915e065f7de"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('id');
    });

    // Skenario 2: Gagal karena Harga Negatif
    it('should return 400 if price is negative', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `API-KEY ${apiKey}`)
            .send({
                sku: "FAIL-SKU-" + Date.now(),
                name: "KAOS OBLONG HITAM",
                price: -500, // Invalid
                stock: 10,
                categoryId: "931ead14-de03-489f-8cb7-3915e065f7de"
            });

        expect(res.statusCode).toEqual(400);

        // Kita buat pengecekan yang lebih fleksibel:
        // Jika Controller Anda mengirim { message: "..." } atau { error: "..." }
        const errorMessage = res.body.message || res.body.error || res.body.errors;
        expect(errorMessage).toBeDefined();
    });

    // Skenario 3: Gagal karena Tanpa API-KEY (SUDAH PASS)
    it('should return 401 if unauthorized', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                sku: "NO-KEY",
                name: "No Key",
                price: 1000,
                stock: 1,
                categoryId: "931ead14-de03-489f-8cb7-3915e065f7de"
            });

        expect(res.statusCode).toEqual(401);
    });
});