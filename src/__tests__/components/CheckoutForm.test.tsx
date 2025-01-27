import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { parse, ValiError } from 'valibot';
import CheckoutForm from '@/components/CheckoutForm';
import { checkoutSchema } from '@/schema';

describe('CheckoutForm', () => {
  const mockHandleFieldChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    errors: {},
    formData: {
      email: '',
      shippingName: '',
      address: '',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: '',
    },
    formRef: { current: null },
    handleFieldChange: mockHandleFieldChange,
    onSubmit: mockOnSubmit,
  };

  const fillForm = (values: Record<string, string>) => {
    const updatedFormData = { ...defaultProps.formData };

    Object.entries(values).forEach(([name, value]) => {
      updatedFormData[name as keyof typeof updatedFormData] = value;
    });

    return updatedFormData;
  };

  const getErrors = (formData: Record<string, string>) => {
    const newErrors: Record<string, string> = {};

    try {
      parse(checkoutSchema, formData);
    } catch (error) {
      if (error instanceof ValiError) {
        error.issues.forEach((issue) => {
          const path = issue.path?.[0].key as string;
          newErrors[path] ||= issue.message;
        });
      }
    } finally {
      return newErrors;
    }
  };

  beforeEach(() => {
    mockHandleFieldChange.mockClear();
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<CheckoutForm {...defaultProps} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name on card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvc/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    const errors = getErrors(defaultProps.formData);

    render(<CheckoutForm {...defaultProps} errors={errors} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    expect(screen.getByText('Card number is required')).toBeInTheDocument();
    expect(screen.getByText('Card holder name is required')).toBeInTheDocument();
    expect(screen.getByText('Expiry date is required')).toBeInTheDocument();
    expect(screen.getByText('CVC is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const formData = fillForm({ email: 'invalid-email' });
    const errors = getErrors(formData);

    render(<CheckoutForm {...defaultProps} errors={errors} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('validates card details format', async () => {
    const formData = fillForm({
      cardNumber: '1234',
      expiry: '13/25',
      cvc: 'abc',
    });
    const errors = getErrors(formData);

    render(<CheckoutForm {...defaultProps} errors={errors} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(await screen.findByText('Invalid card number')).toBeInTheDocument();
    expect(screen.getByText('Invalid expiry date format')).toBeInTheDocument();
    expect(screen.getByText('CVC must contain only numbers')).toBeInTheDocument();
  });

  it('calls onSubmit when form is valid', async () => {
    const formData = fillForm({
      email: 'test@example.com',
      shippingName: 'John Doe',
      address: '123 Main St',
      cardNumber: '4111 1111 1111 1111',
      cardName: 'John Doe',
      expiry: '12/25',
      cvc: '123',
    });
    const errors = getErrors(formData);

    render(<CheckoutForm {...defaultProps} errors={errors} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('clears error when field is updated', async () => {
    const { rerender } = render(<CheckoutForm {...defaultProps} errors={{ email: 'Email is required' }} />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { name: 'email', value: 'test@example.com' } });

    rerender(<CheckoutForm {...defaultProps} formData={{ ...defaultProps.formData, email: 'test@example.com' }} />);

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });
});
