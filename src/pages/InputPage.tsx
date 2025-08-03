import React from 'react';
import { ContentInputForm } from '../components/forms/ContentInputForm';

export const InputPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ContentInputForm />
      </div>
    </div>
  );
};
