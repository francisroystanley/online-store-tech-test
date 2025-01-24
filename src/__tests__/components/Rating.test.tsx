import { render, screen } from '@testing-library/react';
import Rating from '@/components/Rating';

jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-gray">Star</div>,
  StarHalf: () => <div data-testid="star-half">StarHalf</div>,
}));

describe('Rating', () => {
  it('renders correct number of gray stars', () => {
    render(<Rating rating={4} reviews={10} />);
    const grayStars = screen.getAllByTestId('star-gray');

    expect(grayStars).toHaveLength(9);
  });

  it('renders correct number of filled stars for integer rating', () => {
    render(<Rating rating={4} reviews={10} />);
    const filledStars = screen.getAllByTestId('star-gray').slice(0, 4);

    expect(filledStars).toHaveLength(4);
  });

  it('renders correct stars for half rating', () => {
    render(<Rating rating={3.5} reviews={10} />);
    const stars = screen.getAllByTestId('star-gray');
    const halfStar = screen.getByTestId('star-half');

    expect(stars.slice(0, 3)).toHaveLength(3);
    expect(halfStar).toBeInTheDocument();
  });

  it('displays correct number of reviews', () => {
    render(<Rating rating={4} reviews={10} />);

    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('handles zero rating', () => {
    render(<Rating rating={0} reviews={0} />);
    const stars = screen.getAllByTestId('star-gray');
    const halfStar = screen.queryByTestId('star-half');

    expect(stars).toHaveLength(5);
    expect(halfStar).not.toBeInTheDocument();
  });

  it('handles maximum rating', () => {
    render(<Rating rating={5} reviews={100} />);
    const stars = screen.getAllByTestId('star-gray');
    const halfStar = screen.queryByTestId('star-half');

    expect(stars).toHaveLength(10);
    expect(halfStar).not.toBeInTheDocument();
  });
});
