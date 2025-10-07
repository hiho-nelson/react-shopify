import * as React from 'react';

type Option = { value: string; label: string };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  ariaLabel?: string;
}

// Lightweight Select that mimics shadcn style using native <select>
export function Select({ value, onValueChange, options, className = '', ariaLabel, ...rest }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`h-11 w-full border border-black px-3 pr-10 text-base md:text-md focus:outline-none focus:ring-0 appearance-none bg-white`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black"
        viewBox="0 0 12 12"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2.47 4.97a.75.75 0 0 1 1.06 0L6 7.44l2.47-2.47a.75.75 0 1 1 1.06 1.06L6.53 8.97a.75.75 0 0 1-1.06 0L2.47 6.03a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </div>
  );
}


