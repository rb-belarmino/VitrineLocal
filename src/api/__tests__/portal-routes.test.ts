import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../server';

describe('Portal Routes (Integration)', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET / and GET /dashboard', () => {
    it('deve retornar 200 e documento HTML5 do Portal na rota raiz "/"', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text.toLowerCase()).toContain('<!doctype html>');
      expect(res.text).toContain('VitrineLocal');
      expect(res.text).toContain('Portal de Operações');
    });

    it('deve retornar 200 e documento HTML5 do Portal na rota "/dashboard"', async () => {
      const res = await request(app).get('/dashboard');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text.toLowerCase()).toContain('<!doctype html>');
      expect(res.text).toContain('VitrineLocal');
    });
  });

  describe('GET /api/portal/stats', () => {
    it('deve retornar 200 e estatísticas consolidadas do portal', async () => {
      const res = await request(app).get('/api/portal/stats');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalMined');
      expect(res.body.data).toHaveProperty('totalQualified');
      expect(res.body.data).toHaveProperty('totalPreviewsReady');
      expect(res.body.data).toHaveProperty('totalContacted');
      expect(res.body.data).toHaveProperty('totalConverted');
    });
  });
});
