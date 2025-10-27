
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Keep the lucide-react icon mock (simple SVG stubs)
vi.mock('lucide-react', async () => {
	const RealReact = await import('react')
	const makeIcon = (name: string) => (props: any) => RealReact.createElement('svg', { 'data-icon': name, ...props })

	return new Proxy({}, {
		get: (_target, prop: string) => makeIcon(prop as string)
	})
})

// Mock Socket.IO client to prevent real socket connections during tests
vi.mock('socket.io-client', () => ({
	io: () => ({
		on: () => {},
		emit: () => {},
		disconnect: () => {},
	}),
}))

// Mock Prisma Client to avoid real DB connections during unit tests
vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		$connect: () => Promise.resolve(),
		$disconnect: () => Promise.resolve(),
		user: { findMany: () => Promise.resolve([]) },
		// add additional model stubs if tests require them
	})),
}))

// Ensure cleanup and restore mocks after each test
afterEach(() => {
	cleanup()
	vi.restoreAllMocks()
	try { vi.useRealTimers() } catch (e) { /* ignore if not using fake timers */ }
})

