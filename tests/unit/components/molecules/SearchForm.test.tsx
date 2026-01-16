import { SearchForm } from '@/components/molecules/SearchForm';
import { fireEvent, render, screen } from '@testing-library/react';

describe('SearchForm', () => {
  it('入力フィールドとボタンが表示される', () => {
    render(<SearchForm onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('カスタムプレースホルダーが表示される', () => {
    render(<SearchForm onSearch={jest.fn()} placeholder="楽曲を検索..." />);

    expect(screen.getByPlaceholderText('楽曲を検索...')).toBeInTheDocument();
  });

  it('デフォルト値が入力フィールドに表示される', () => {
    render(<SearchForm onSearch={jest.fn()} defaultValue="test query" />);

    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('フォーム送信時にonSearchが呼ばれる', () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('検索...');
    fireEvent.change(input, { target: { value: 'test query' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('空文字でも送信できる', () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('入力値が変更される', () => {
    render(<SearchForm onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('検索...');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(screen.getByDisplayValue('new value')).toBeInTheDocument();
  });

  it('Enterキーでフォームが送信される', () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('検索...');
    fireEvent.change(input, { target: { value: 'enter test' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleSearch).toHaveBeenCalledWith('enter test');
  });
});
