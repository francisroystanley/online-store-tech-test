import { Star, StarHalf } from 'lucide-react';
import { useCallback } from 'react';

type Props = {
  rating: number;
  reviews: number;
};

const Rating = ({ rating, reviews }: Props) => {
  const FilledStars = useCallback(
    () => (
      <div className="flex gap-0.5 absolute top-0 left-0">
        {Array.from({ length: Math.ceil(rating) }, (_, index) => {
          const isHalf = Math.ceil(rating) === index + 1 && !Number.isInteger(rating);
          const StarComponent = isHalf ? StarHalf : Star;

          return (
            <StarComponent
              key={index}
              fill="#FFD700"
              strokeWidth={0}
              data-testid={isHalf ? 'star-half' : 'star-filled'}
            />
          );
        })}
      </div>
    ),
    [rating],
  );

  const GrayStars = useCallback(
    () => (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} fill="#E5E7EB" strokeWidth={0} data-testid="star-gray" />
        ))}
      </div>
    ),
    [],
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <GrayStars />
        <FilledStars />
      </div>
      <div className="font-medium text-sm leading-[17px] text-[#707784]">({reviews})</div>
    </div>
  );
};

export default Rating;
