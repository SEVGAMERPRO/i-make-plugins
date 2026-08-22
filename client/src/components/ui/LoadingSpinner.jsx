import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 text-[#2196F3] animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
