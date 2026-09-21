import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'specs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/modules/radar/**/*.ts', 'src/api/**/*.ts'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/types.ts',
        'src/**/*.types.ts',
        'src/**/*.schemas.ts',
        'src/modules/radar/scraper/maps-selectors.ts',
        'src/modules/radar/scraper/browser-pool.ts'
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85
      }
    }
  }
});
