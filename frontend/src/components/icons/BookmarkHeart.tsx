import { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';

const BookmarkHeart = forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, strokeWidth = 2, className = '', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Bookmark path */}
        <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h3.5" />
        {/* Heart path */}
        <path d="M18.8 4c-.9 0-1.8.4-2.3 1.1-.5-.7-1.4-1.1-2.3-1.1-1.6 0-2.8 1.3-2.8 2.9 0 2 2.3 4 5.1 6.5 2.8-2.5 5.1-4.5 5.1-6.5 0-1.6-1.3-2.9-2.8-2.9z" />
      </svg>
    );
  }
);

BookmarkHeart.displayName = 'BookmarkHeart';

export default BookmarkHeart;
