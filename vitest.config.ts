import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  // No Vite plugins required for unit tests here
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/coverage/**',
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        'dist/**',
        '.next/**',
        'coverage/**',
        'app/layout.tsx',
        'app/globals.css',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/mailer': path.resolve(__dirname, './src/mailer'),
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    watch: false,
    reporters: ['verbose'],
    ui: false,
    inspect: false,
    isolate: true,
    retry: 0,
    benchmark: {
      include: ['**/*.bench.{ts,tsx}'],
      exclude: ['node_modules', 'dist'],
    },
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/restaurant_test',
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    // deps.inline removed for compatibility with current Vitest typings
    // threads and thread counts removed for compatibility with current Vitest typings
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    dangerouslyIgnoreUnhandledErrors: false,
    // poolOptions removed for compatibility
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/mailer': path.resolve(__dirname, './src/mailer'),
    },
  },
});
