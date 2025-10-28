import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// 🌍 Mocks globaux
global.fetch = vi.fn() as any;

// 📱 Mock IntersectionObserver (pour les composants lazy)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(),
})) as any;

// 🖼️ Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// 📍 Mock window.matchMedia (pour responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 🔔 Mock notifications
global.Notification = vi.fn().mockImplementation(() => ({
  permission: 'granted',
  requestPermission: vi.fn().mockResolvedValue('granted'),
})) as any;

// 📊 Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as any;
global.sessionStorage = localStorageMock as any;

// Keep the lucide-react icon mock (simple SVG stubs)
vi.mock('lucide-react', async () => {
  const RealReact = await import('react');
  const makeIcon = (name: string) => (props: any) =>
    RealReact.createElement('svg', { 'data-icon': name, ...props });

  return new Proxy(
    {},
    {
      get: (_target, prop: string) => makeIcon(prop as string),
    },
  );
});

// Mock Socket.IO client to prevent real socket connections during tests
vi.mock('socket.io-client', () => ({
  io: () => ({
    on: () => {},
    emit: () => {},
    disconnect: () => {},
  }),
}));

// Mock Prisma Client to avoid real DB connections during unit tests
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    user: { findMany: () => Promise.resolve([]) },
  })),
}));

// Ensure cleanup and restore mocks after each test
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  try {
    vi.useRealTimers();
  } catch (e) {
    /* ignore if not using fake timers */
  }
});
