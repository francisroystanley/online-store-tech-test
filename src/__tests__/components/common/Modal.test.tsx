import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/common/Modal';

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon">X</div>,
}));

describe('Modal', () => {
  const mockSetOpen = jest.fn();
  const defaultProps = {
    open: true,
    setOpen: mockSetOpen,
    title: 'Test Modal',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(
      <Modal {...defaultProps} open={false}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    const footer = <button>Footer Button</button>;

    render(
      <Modal {...defaultProps} footer={footer}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('calls setOpen when clicking close button', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal Content</div>
      </Modal>,
    );

    const closeButton = screen.getByTestId('close-icon').parentElement;

    if (!closeButton) throw new Error('Close button not found');

    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('calls setOpen when pressing escape key', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('renders with correct accessibility attributes', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal Content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument();
  });

  it('renders without footer', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal Content</div>
      </Modal>,
    );

    const footerSection = document.querySelector('.sm\\:flex.sm\\:flex-row-reverse');

    expect(footerSection).not.toBeInTheDocument();
  });
});
