'use client';

import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import Phone from './Phone';

const PHONES = [
  '/testimonials/1.jpg',
  '/testimonials/2.jpg',
  '/testimonials/3.jpg',
  '/testimonials/4.jpg',
  '/testimonials/5.jpg',
  '/testimonials/6.jpg'
];

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;

    if (!result[index]) result[index] = [];
    result[index].push(array[i]);
  }

  return result;
}

function Reviews() {
  return (
    <div className="relative max-w-5xl mx-auto px-2.5 md:px-20">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute -left-32 top-1/3 hidden xl:block select-none"
      />
      <ReviewGrid />
    </div>
  );
}
export default Reviews;

function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-8 h-[49rem] overflow-hidden px-4 mt-16 sm:mt-20 select-none"
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                'md:hidden': reviewIndex >= column1.length + column3[0].length,
                'lg:hidden': reviewIndex >= column1.length,
              })}
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) => reviewIndex >= column2.length ? 'lg:hidden' : ''}
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      )}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100 pointer-events-none " />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100 pointer-events-none" />
    </div>
  );
}

function ReviewColumn({ reviews, className, reviewClassName, msPerPixel = 0 }: {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn('animate-marquee space-y-8 py-4', className)}
      style={{ '--marquee-duration': duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        <Review
          key={reviewIndex}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}

type ReviewProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
};

function Review({ imgSrc, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = ['0s', '0.1s', '0.2s', '0.3s', '0.4s', '0.5s'] as const;
  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)];

  return (
    <div
      className={cn(
        'animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5',
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}
