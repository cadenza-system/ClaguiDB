import { render, screen, fireEvent } from '@testing-library/react';
import { TagChip } from '@/components/molecules/TagChip';

// Next.js Link をモック
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('TagChip', () => {
  it('タグ名が表示される', () => {
    render(<TagChip name="Romantic" />);

    expect(screen.getByText('Romantic')).toBeInTheDocument();
  });

  it('clickableがtrueの場合、リンクとしてレンダリングされる', () => {
    render(<TagChip name="Baroque" clickable={true} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/pieces/search?tag=Baroque'
    );
  });

  it('日本語タグ名がURLエンコードされる', () => {
    render(<TagChip name="ロマンティック" clickable={true} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/pieces/search?tag=%E3%83%AD%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF'
    );
  });

  it('clickableがfalseの場合、リンクではなくChipとしてレンダリングされる', () => {
    render(<TagChip name="Modern" clickable={false} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
  });

  it('clickableがfalseでonClickがある場合、クリックイベントが発火する', () => {
    const handleClick = jest.fn();
    render(<TagChip name="Spanish" clickable={false} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Spanish'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('デフォルトでclickableがtrue', () => {
    render(<TagChip name="Latin" />);

    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
