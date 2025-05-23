import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import FormItemMenu from '../components/admin/FormItemMenu';

describe('FormItemMenu', () => {
  it('renderiza inputs e botão', () => {
    render(<FormItemMenu onSubmit={jest.fn()} isLoading={false} />);
    expect(screen.getByLabelText(/Nome do item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('botão desabilitado se nome, descrição ou preço vazios', () => {
    render(<FormItemMenu onSubmit={jest.fn()} isLoading={false} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('submete dados corretamente', () => {
    const onSubmit = jest.fn();
    render(<FormItemMenu onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/Nome do item/i), { target: { value: 'Hambúrguer' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Delicioso' } });
    fireEvent.change(screen.getByLabelText(/Preço/i), { target: { value: '25.50' } });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Hambúrguer',
      description: 'Delicioso',
      price: 25.50,
    });
  });
});
