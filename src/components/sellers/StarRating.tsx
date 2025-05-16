
import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return (
    <div className="flex">
      {Array(5).fill(0).map((_, i) => (
        <StarIcon 
          key={i}
          className={`h-4 w-4 ${
            i < fullStars 
              ? "text-yellow-500 fill-yellow-500" 
              : i === fullStars && hasHalfStar 
                ? "text-yellow-500 fill-yellow-500/50" 
                : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
