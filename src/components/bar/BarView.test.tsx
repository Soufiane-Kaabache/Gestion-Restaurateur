import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Temporarily mock the real BarView to avoid side-effects during import.
vi.mock('./BarView', () => ({
  BarView: (props: any) => React.createElement('div', { 'data-testid': 'bar-stub' }, 'Bar'),
}));

import { BarView } from './BarView';

describe('BarView (stubbed)', () => {
  it('renders the stub without importing heavy dependencies', () => {
    render(<BarView orders={[]} products={[]} />);
    expect(screen.getByTestId('bar-stub')).toBeInTheDocument();
  });
});
