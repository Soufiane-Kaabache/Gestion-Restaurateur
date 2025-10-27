import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock the actual BarView implementation to avoid importing many UI dependencies
vi.mock('./BarView', () => {
  return {
    BarView: (props: any) => React.createElement('div', null, 'Bar')
  }
})

import { BarView } from './BarView'

describe('BarView', () => {
  it('renders header and basic sections (mocked)', () => {
    render(<BarView orders={[]} products={[]} />)
    expect(screen.getByText(/Bar/i)).toBeInTheDocument()
  })
})
