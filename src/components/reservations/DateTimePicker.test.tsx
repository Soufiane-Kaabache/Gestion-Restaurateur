import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateTimePicker from './DateTimePicker';

describe('DateTimePicker', () => {
  it('renders and allows time selection', () => {
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} />);

    const select = screen.getByTestId('time-select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: '19:00' } });
    expect(onChange).toHaveBeenCalled();
  });
});
