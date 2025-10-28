import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TableForm } from './TableForm';

describe('TableForm - SelectItem behavior', () => {
  it('selecting "Aucune" results in section being undefined on submit', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TableForm onSubmit={onSubmit} onCancel={onCancel} />);

    // fill required fields
    const numberInput = screen.getByLabelText(/Numéro/i) as HTMLInputElement;
    const capacityInput = screen.getByLabelText(/Capacité/i) as HTMLInputElement;
    fireEvent.change(numberInput, { target: { value: '1' } });
    fireEvent.change(capacityInput, { target: { value: '4' } });

    // open select and choose "Aucune"
    const trigger = screen.getByText(/Sélectionner une section/i);
    fireEvent.click(trigger);

    const noneOption = await screen.findByText('Aucune');
    fireEvent.click(noneOption);

    // submit form
    const submitBtn = screen.getByRole('button', { name: /Créer|Modifier/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalled();
    const calledWith = onSubmit.mock.calls[0][0];
    expect(calledWith).toMatchObject({ number: 1, capacity: 4 });
    // section should be undefined when "Aucune" is selected
    expect(calledWith).not.toHaveProperty('section', expect.any(String));
  });
});
