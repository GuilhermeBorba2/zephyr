import React from 'react';
import { Wind } from 'lucide-react';

const AnimatedLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Wind className="w-8 h-8 text-blue-600 animate-[wave_2s_ease-in-out_infinite]" />
        <Wind className="w-8 h-8 absolute top-0 left-0 text-blue-600/30 animate-[wave_2s_ease-in-out_infinite_0.5s]" />
      </div>
      <span className="text-xl font-semibold text-gray-900 dark:text-white">
        Zephyr
      </span>
    </div>
  );
};

export default AnimatedLogo;