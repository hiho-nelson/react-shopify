import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ children, className = '', containerClassName = '' }: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className={`w-full px-4 sm:px-6 lg:px-[10%] ${containerClassName}`}>{children}</div>
    </section>
  );
}


