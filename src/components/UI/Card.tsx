import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx(
      'bg-white rounded-xl shadow-sm border border-gray-200',
      className
    )}>
      {children}
    </div>
  );
};
