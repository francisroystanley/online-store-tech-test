import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders footer with correct text', () => {
    render(<Footer />);

    expect(screen.getByText('The Fake Store Copyright 2024')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<Footer />);
    const footerDiv = container.firstChild as HTMLElement;

    expect(footerDiv).toHaveClass(
      'flex',
      'justify-between',
      'items-center',
      'mx-5',
      'h-[65px]',
      'bg-white',
      'border-t',
      'border-[#E5E7EB]',
    );
  });

  it('renders as a single container with nested content', () => {
    const { container } = render(<Footer />);

    expect(container.childNodes).toHaveLength(1);
    expect(container.firstChild?.childNodes).toHaveLength(1);
  });
});
