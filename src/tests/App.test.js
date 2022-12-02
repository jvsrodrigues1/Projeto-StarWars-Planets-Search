import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event'
import planetMocks from '../helpers/planetMocks';

describe("Testes MainPage", () => {
  it("Teste dos inputs", async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)

    const nameFilter = screen.getByTestId("name-filter")
    const columnFilter = screen.getByTestId("column-filter");
    const comparisonFilter = screen.getByTestId("comparison-filter");
    const buttonFilter = screen.getByTestId("button-filter")
    const valueFilter = screen.getByTestId("value-filter");
    expect(valueFilter).toHaveValue(0)
    expect(comparisonFilter).toHaveValue('maior que')
    expect(comparisonFilter).toHaveLength(3)
    expect(columnFilter).toHaveValue('population')
    expect(columnFilter).toHaveLength(5)

    const tatooine = await screen.findByRole('cell', { name: /tatooine/i })

    userEvent.type(nameFilter, 'Hoth');
    await screen.findByRole('cell', { name: /hoth/i })
    userEvent.clear(nameFilter)
    await screen.findByRole('cell', { name: /tatooine/i })

    //userEvent.clear(valueFilter);
    userEvent.type(valueFilter, 200000);
    userEvent.click(buttonFilter);

    await waitFor(async () => {
      screen.getByRole('cell', { name: /coruscant/i })
    }, { timeout: 2000 })

  })

  it('Teste 2', async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)
    const buttonFilter = screen.getByTestId("button-filter")
    const buttonOrder = screen.getByRole('button', { name: /ordenar/i })
    const radioAsc = screen.getByRole('radio', { name: /ascendente/i })

    const radioDesc = screen.getByRole('radio', { name: /descendente/i })
    await screen.findByRole('cell', { name: /tatooine/i });
    userEvent.click(radioAsc);
    userEvent.click(buttonFilter);
    userEvent.click(buttonOrder);
    const list = await screen.findAllByTestId('planet-name')
    const population = await screen.findAllByTestId('planet-population');

    expect(list[0].innerHTML).toBe('Yavin IV')
    const column_filter = screen.getByTestId('column-filter');
    expect(column_filter).toHaveLength(4)
    userEvent.click(radioDesc);
    userEvent.click(buttonOrder);
    const newlist = await screen.findAllByTestId('planet-name')
    expect(newlist[0].innerHTML).toBe('Coruscant');

  })
  it('Table test', () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)
    const buttonFilter = screen.getByTestId("button-filter")
    userEvent.selectOptions(
      screen.getByTestId("comparison-filter"),
      screen.getByRole("option", { name: "menor que" })
    );
    userEvent.click(buttonFilter);

    userEvent.selectOptions(
      screen.getByTestId("comparison-filter"),
      screen.getByRole("option", { name: "igual a" })
    );

    userEvent.click(buttonFilter);
  })

  it('Teste Ascendente/Descendente', async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)
    const asc = screen.getByRole('radio', { name: /ascendente/i });
    const desc = screen.getByRole('radio', { name: /descendente/i });

    const ord = screen.getByRole('button', { name: /ordenar/i })



    userEvent.click(asc);
    await screen.findByRole('cell', { name: /yavin iv/i })
    await screen.findByRole('cell', { name: /hoth/i })
    userEvent.click(ord);
    const lista = await screen.findAllByTestId('planet-population');
    expect(lista[lista.length - 1].innerHTML).toBe('unknown')
    userEvent.click(desc)
    userEvent.click(ord)
  })

  it('Teste remoção de filtros', async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)

    const buttonFilter = screen.getByTestId("button-filter")
    const valueFilter = screen.getByTestId("value-filter");


    userEvent.selectOptions(
      screen.getByTestId("comparison-filter"),
      screen.getByRole("option", { name: "menor que" })
    );

    const comparisonFilter = screen.getByTestId("comparison-filter");
    expect(comparisonFilter).toHaveValue('menor que');
    const columnFilter = screen.getByTestId('column-filter');

    userEvent.clear(valueFilter)
    userEvent.type(valueFilter, '2000');
    expect(valueFilter).toHaveValue(2000);
    userEvent.click(buttonFilter)


    await waitFor(async () => {
      const nameList = await screen.findAllByTestId('planet-name');
      expect(nameList).toHaveLength(1);
      expect(columnFilter).toHaveLength(4);
    }, { timeout: 2000 });

    const removeFilters = screen.getByRole('button', { name: /remover filtros/i })

    userEvent.click(removeFilters);

    const nameList = await screen.findAllByTestId('planet-name');
    expect(nameList).toHaveLength(10);
    expect(columnFilter).toHaveLength(5);
  })

  it('Segundo teste remoção de filtros', async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(planetMocks),
    });
    render(<App />)

    const buttonFilter = screen.getByTestId("button-filter")
    const valueFilter = screen.getByTestId("value-filter");


    userEvent.selectOptions(
      screen.getByTestId("comparison-filter"),
      screen.getByRole("option", { name: "menor que" })
    );

    const comparisonFilter = screen.getByTestId("comparison-filter");
    expect(comparisonFilter).toHaveValue('menor que');
    const columnFilter = screen.getByTestId('column-filter');

    userEvent.clear(valueFilter)
    userEvent.type(valueFilter, '2000');
    expect(valueFilter).toHaveValue(2000);
    userEvent.click(buttonFilter)


    await waitFor(async () => {
      const nameList = await screen.findAllByTestId('planet-name');
      expect(nameList).toHaveLength(1);
      expect(columnFilter).toHaveLength(4);
    }, { timeout: 2000 });

    const buttonX = screen.getByRole('button', { name: /x/i })
    userEvent.click(buttonX);

    const nameList = await screen.findAllByTestId('planet-name');
    expect(nameList).toHaveLength(10);
    expect(columnFilter).toHaveLength(5);

  })
})