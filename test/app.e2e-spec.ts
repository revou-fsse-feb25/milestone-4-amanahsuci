import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Revobank App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
    await prisma.account.deleteMany();
    await prisma.transaction.deleteMany();
  });

  describe('Authentication', () => {
    it('/auth/register (POST)', async () => {
      const userData = {
        email: 'test@revobank.com',
        name: 'Test User',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(userData.email);
          expect(res.body.name).toBe(userData.name);
          expect(res.body.id).toBeDefined();
          expect(res.body.password).toBeUndefined();
        });
    });

    it('/auth/login (POST)', async () => {
      // First create a user
      const userData = {
        email: 'test@revobank.com',
        name: 'Test User',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      // Then login
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
        });
    });
  });

  describe('Users', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login user for protected routes
      const userData = {
        email: 'test@revobank.com',
        name: 'Test User',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      authToken = loginResponse.body.access_token;
    });

    it('/users (GET)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/users/:id (GET)', async () => {
      // Get current user ID first
      const profileResponse = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      const userId = profileResponse.body.id;

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe('test@revobank.com');
        });
    });
  });

  describe('Accounts', () => {
    let authToken: string;
    let userId: number;

    beforeEach(async () => {
      const userData = {
        email: 'test@revobank.com',
        name: 'Test User',
        password: 'password123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      userId = registerResponse.body.id;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      authToken = loginResponse.body.access_token;
    });

    it('/accounts (POST) - should create account', () => {
      const accountData = {
        accountType: 'SAVINGS',
        initialBalance: 1000,
      };

      return request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accountData)
        .expect(201)
        .expect((res) => {
          expect(res.body.accountType).toBe(accountData.accountType);
          expect(res.body.balance).toBe(accountData.initialBalance);
          expect(res.body.accountNumber).toBeDefined();
          expect(res.body.userId).toBe(userId);
        });
    });

    it('/accounts (GET) - should get user accounts', async () => {
      // Create an account first
      await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ accountType: 'SAVINGS', initialBalance: 1000 });

      return request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Transactions', () => {
    let authToken: string;
    let accountId: number;

    beforeEach(async () => {
      const userData = {
        email: 'test@revobank.com',
        name: 'Test User',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      authToken = loginResponse.body.access_token;

      // Create account
      const accountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ accountType: 'SAVINGS', initialBalance: 1000 });

      accountId = accountResponse.body.id;
    });

    it('/transactions/deposit (POST)', () => {
      const depositData = {
        accountId,
        amount: 500,
        description: 'Test deposit',
      };

      return request(app.getHttpServer())
        .post('/transactions/deposit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(depositData)
        .expect(201)
        .expect((res) => {
          expect(res.body.amount).toBe(depositData.amount);
          expect(res.body.type).toBe('DEPOSIT');
          expect(res.body.description).toBe(depositData.description);
        });
    });

    it('/transactions/withdraw (POST)', () => {
      const withdrawData = {
        accountId,
        amount: 200,
        description: 'Test withdrawal',
      };

      return request(app.getHttpServer())
        .post('/transactions/withdraw')
        .set('Authorization', `Bearer ${authToken}`)
        .send(withdrawData)
        .expect(201)
        .expect((res) => {
          expect(res.body.amount).toBe(withdrawData.amount);
          expect(res.body.type).toBe('WITHDRAW');
          expect(res.body.description).toBe(withdrawData.description);
        });
    });

    it('/transactions/withdraw (POST) - should fail with insufficient balance', () => {
      const withdrawData = {
        accountId,
        amount: 2000, 
        description: 'Test overdraw',
      };

      return request(app.getHttpServer())
        .post('/transactions/withdraw')
        .set('Authorization', `Bearer ${authToken}`)
        .send(withdrawData)
        .expect(400);
    });
  });
});