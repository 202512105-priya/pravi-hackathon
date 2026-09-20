import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'High' | 'Medium' | 'Low' | 'Success' | 'Neutral';
  className?: string;
}

export function Badge({ children, variant = 'Neutral', className = '' }: BadgeProps) {
  const variantStyles = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-saffron/20 text-saffron', // using tailwind saffron
    Low: 'bg-blue-100 text-primary',
    Success: 'bg-green/20 text-green', // tailwind green
    Neutral: 'bg-slate-100 text-slate-700'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
