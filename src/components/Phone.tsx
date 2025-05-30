import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type PhoneProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
  dark?: boolean;
};

function Phone({ imgSrc, className, dark = false, ...props }: PhoneProps) {
  return (
    <div
      className={cn('relative pointer-events-none select-none z-50 overflow-hidden', className)}
      {...props}
    >
      <img
        src={dark ? '/phone-template-dark-edges.png' : '/phone-template-white-edges.png'}
        alt="phone image"
      />

      <div className="absolute -z-10 inset-0">
        <img
          className="object-cover w-full min-h-full"
          src={imgSrc}
          alt="overlaying phone image"
        />
      </div>
    </div>
  );
}
export default Phone;
