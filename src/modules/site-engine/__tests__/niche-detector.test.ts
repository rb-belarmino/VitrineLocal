import { describe, it, expect } from 'vitest';
import { NicheDetector } from '../core/niche-detector';

describe('NicheDetector (Unit)', () => {
  const detector = new NicheDetector();

  it('deve mapear termos odontológicos e médicos para nicho saude', () => {
    expect(detector.detect('Clínica odontológica')).toBe('saude');
    expect(detector.detect('Dentista')).toBe('saude');
    expect(detector.detect('Centro Médico e Fisioterapia')).toBe('saude');
    expect(detector.detect('Hospital dos Olhos')).toBe('saude');
  });

  it('deve mapear termos mecânicos e de veículos para nicho automotivo', () => {
    expect(detector.detect('Oficina mecânica')).toBe('automotivo');
    expect(detector.detect('Auto Elétrica e Troca de Óleo')).toBe('automotivo');
    expect(detector.detect('Centro Automotivo & Pneus')).toBe('automotivo');
    expect(detector.detect('Funilaria e Pintura de Motos')).toBe('automotivo');
  });

  it('deve mapear restaurantes, pizzarias e cafeterias para nicho gastronomia', () => {
    expect(detector.detect('Restaurante Italiano')).toBe('gastronomia');
    expect(detector.detect('Pizzaria & Forno a Lenha')).toBe('gastronomia');
    expect(detector.detect('Hamburgueria Artesanal')).toBe('gastronomia');
    expect(detector.detect('Café & Padaria')).toBe('gastronomia');
  });

  it('deve mapear salões de beleza, barbearias e estética para nicho beleza', () => {
    expect(detector.detect('Salão de beleza e cabeleireiro')).toBe('beleza');
    expect(detector.detect('Barbearia Tradicional')).toBe('beleza');
    expect(detector.detect('Clínica de Estética e Manicure')).toBe('beleza');
    expect(detector.detect('Spa e Massoterapia')).toBe('beleza');
  });

  it('deve retornar fallback geral para categorias não mapeadas ou vazias', () => {
    expect(detector.detect('Contabilidade e Assessoria')).toBe('geral');
    expect(detector.detect('Advocacia Empresarial')).toBe('geral');
    expect(detector.detect('')).toBe('geral');
    expect(detector.detect('Serviços Locais')).toBe('geral');
  });
});
