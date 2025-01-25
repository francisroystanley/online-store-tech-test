import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/common/Button';

describe('Button', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with default primary color', () => {
    render(<Button label="Click me" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#4F46E5] text-white');
  });

  it('renders with secondary color', () => {
    render(<Button label="Click me" color="secondary" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toHaveClass('bg-[#16A34A] text-white');
  });

  it('renders with dark color', () => {
    render(<Button label="Click me" color="dark" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toHaveClass('bg-black text-white');
  });

  it('handles additional className correctly', () => {
    const { unmount } = render(<Button label="Click me" className="custom-class" onClick={mockOnClick} />);
    let button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toHaveClass('custom-class');
    unmount();

    render(<Button label="Click me" className="" onClick={mockOnClick} />);

    button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toHaveClass('rounded-[10px] p-2 bg-[#4F46E5] text-white');
    expect(button).not.toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    render(<Button label="Click me" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
