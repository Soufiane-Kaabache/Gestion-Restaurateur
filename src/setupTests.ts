import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock lucide-react icons to simple stub components to avoid module resolution
vi.mock('lucide-react', async () => {
	const RealReact = await import('react')
	const makeIcon = (name: string) => (props: any) => RealReact.createElement('svg', { 'data-icon': name, ...props })

	return new Proxy({}, {
		get: (_target, prop: string) => makeIcon(prop)
	})
})

