import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormRestaurant from '../components/admin/FormRestaurant';

describe('FormRestaurant', () => {
  it('renderiza os inputs e botão', () => {
    render(<FormRestaurant onSubmit={jest.fn()} isLoading={false} />);
    expect(screen.getByLabelText(/Nome do restaurante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição do restaurante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('botão desabilitado se algum campo obrigatório está vazio', () => {
    render(<FormRestaurant onSubmit={jest.fn()} isLoading={false} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('submete dados corretamente', () => {
    const onSubmit = jest.fn();
    render(<FormRestaurant onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/Nome do restaurante/i), { target: { value: 'Divinuz' } });
    fireEvent.change(screen.getByLabelText(/Descrição do restaurante/i), { target: { value: 'Comida boa' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(48) 99999-9999' } });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Divinuz',
      description: 'Comida boa',
      phone: '(48) 99999-9999',
    });
  });
});
