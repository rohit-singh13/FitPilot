const request = require('supertest');
const express = require('express');
const { connectTestDB, closeTestDB, clearTestDB } = require('../config/testDb');
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

describe('Auth endpoints', () => {
    test('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
    });

    test('should not register with a duplicate email', async () => {
        await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/auth/register').send({
            fullName: 'Another User',
            email: 'test@example.com',
            password: 'password456',
        });

        expect(res.statusCode).toBe(400);
    });

    test('should login with correct credentials', async () => {
        await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'login@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'login@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('should reject login with wrong password', async () => {
        await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'wrongpass@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'wrongpass@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(401);
    });
});