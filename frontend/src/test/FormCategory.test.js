import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import FormCategory from '../components/admin/FormCategory';

describe('FormCategory', () => {
  it('renderiza o formulário com input e botão', () => {
    render(<FormCategory onSubmit={jest.fn()} isLoading={false} />);
    expect(screen.getByLabelText(/Nome da categoria/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('botão está desabilitado quando o nome está vazio', () => {
    render(<FormCategory onSubmit={jest.fn()} isLoading={false} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('chama onSubmit com o valor do input ao submeter', () => {
    const onSubmit = jest.fn();
    render(<FormCategory onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByLabelText(/Nome da categoria/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Comidas' } });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Comidas' });
  });
});
