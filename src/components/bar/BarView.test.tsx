import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { BarView } from './BarView'

describe('BarView (integration)', () => {
  it('renders header, description and quick stats when given empty data', () => {
    render(<BarView orders={[]} products={[]} />)

    // Header
    expect(screen.getByRole('heading', { name: /Bar/i })).toBeInTheDocument()

    // Description
    expect(screen.getByText(/Gestion des commandes et stocks du bar/i)).toBeInTheDocument()

    // Quick stats card labels appear
    expect(screen.getByText(/Produits bar/i)).toBeInTheDocument()
    expect(screen.getByText(/En attente/i)).toBeInTheDocument()
    expect(screen.getByText(/En préparation/i)).toBeInTheDocument()
    expect(screen.getByText(/Prêtes/i)).toBeInTheDocument()
  })
})
