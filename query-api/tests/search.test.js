import request from 'supertest';
import app from '../src/app.js';
import 'dotenv/config';

describe('Search API Unit Tests', () => {
    const apiKey = process.env.MY_API_KEY;

    // Test Skenario 1: Berhasil Search tanpa filter (Get All)
    it('should return all products with status 200', async () => {
        const res = await request(app)
            .get('/api/search')
            .set('Authorization', `API-KEY ${apiKey}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('paging');
    });

    // Test Skenario 2: Gagal jika API-KEY salah (Unauthorized)
    it('should return 401 if API-KEY is invalid', async () => {
        const res = await request(app)
            .get('/api/search')
            .set('Authorization', `API-KEY salah_token`);

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Unauthorized');
    });

    // Test Skenario 3: Search berdasarkan SKU
    it('should filter products by SKU', async () => {
        const targetSku = 'FNB-COFFEE-001';
        const res = await request(app)
            .get(`/api/search?sku=${targetSku}`)
            .set('Authorization', `API-KEY ${apiKey}`);

        expect(res.statusCode).toEqual(200);
        if (res.body.data.length > 0) {
            expect(res.body.data[0].sku).toEqual(targetSku);
        }
    });

    // Test Skenario 4: Pagination check
    it('should return correct paging structure', async () => {
        const res = await request(app)
            .get('/api/search?size=5&page=1')
            .set('Authorization', `API-KEY ${apiKey}`);

        expect(res.body.paging.size).toEqual(5);
        expect(res.body.paging.current).toEqual(1);
    });
});